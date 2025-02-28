const User = require("../models/user");
const passport = require("passport");
const Documents = require("../models/document");
const Collaborate = require("../models/collaborate");
const sendNotification = require('../config/socket').sendNotification

exports.document_create = [
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const documentExists = await Documents.findOne({
        $and: [{ title: req.body.title }, { id: req.user._id }],
      });
      if (documentExists) {
        res.send({ msg: "Please choose another title", success: false });
        return;
      }
      const createDocument = new Documents({
        title: req.body.title,
        author: req.user._id,
        content: '<p>Hello</p>'
      });
      let newDocument = await createDocument.save();
      res.status(201).send({ msg: "Document created", success: true });
    } catch (err) {
      console.log(err);
      res.status(500).send({ success: false });
    }
  },
];

exports.document_get = [
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const ownDocuments = await Documents.find({ author: req.user._id });
      const user = await User.findById(req.user._id);
      const collDocuments = user.documents;
      const allDocuments = ownDocuments.concat(collDocuments);
      if (allDocuments.length === 0) {
        res.status(404).send({ success: false, msg: "No documents found" });
        return;
      }
      res.json(allDocuments);
    } catch (err) {
      console.log(err);
      res.status(500).send({ success: false });
    }
  },
];

exports.document_delete = [
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const documentID = req.params.id;
      const document = await Documents.findById(documentID);
      if (!document.author.equals(req.user._id)) {
        return res.status(500).send({
          success: false,
          msg: "You cannot delete a document that is not yours",
        });
      }
      const allUserIDs = document.collaborators.map((doc) => {
        return doc.user;
      });

      const allUsersWhoShareThisDoc = await User.updateMany(
        { _id: { $in: allUserIDs } },
        { $pull: { documents: { _id: documentID } } }
      );

      const documentToBeDeleted = await Documents.deleteOne({
        _id: documentID,
      });
      res.status(200).send({ msg: documentToBeDeleted, success: true });
    } catch (err) {
      console.log(err);
      res.status(500).send({ success: false });
    }
  },
];

exports.document_send_invite = [
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const friendUsername = req.body.username.toLowerCase();
      const documentID = req.body.documentID;
      const authorID = req.user._id;

      // search for user in database. If user does not exist. Send propper message and exit function
      const userToBeAdded = await User.findOne({ username: friendUsername });
      if (!userToBeAdded) {
        res.status(404).send({
          success: false,
          msg: "This user does not exist. Please try again",
        });
        return;
      }

      // search if user that wants to collaborate is the author of the document. If it is, send proper msg
      // and exit function
      const userToBeAddedID = userToBeAdded._id;
      if (userToBeAddedID.equals(authorID)) {
        res.status(400).send({
          success: false,
          msg: "You cannot invite yourself...",
        });
        return;
      }

      // search if user already has a pending invite. If he has, send proper msg and exit function
      const document = await Documents.findOne({ _id: documentID });
      const documentCollaborators = document.collaborators;
      const isUserInCollaborators = documentCollaborators.some(
        (collaborator) => {
          return userToBeAddedID.equals(collaborator.user);
        }
      );
      if (isUserInCollaborators) {
        res.status(409).send({
          success: false,
          msg: "User already has a pending invite...",
        });
        return;
      }

      // create new schema and update the document model with new user.
      // Start user with pending status until request is accepted
      const collaborateUser = new Collaborate({
        user: userToBeAddedID,
        status: "pending",
      });
      document.collaborators.push(collaborateUser);
      await document.save();

      // Add document to user's invite array
      userToBeAdded.invites.push(document);
      await userToBeAdded.save();
      sendNotification(userToBeAddedID, {type: 'Invite'});
      res.status(200).send({ success: true, msg: "Invite sent" });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send({ success: false, msg: "Internal server error" });
    }
  },
];

exports.document_display_collaborators = [
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      // Send all the collaborators within a single document only with their username, id, and coll status
      const documentID = req.params.id;
      const document = await Documents.findById(documentID, {
        collaborators: 1,
      }).populate({
        path: "collaborators",
        populate: { path: "user", select: "username" },
      });
      const collaborators = document.collaborators;
      if (collaborators.length === 0) {
        res.status(404).send({
          success: false,
          msg: "There are no collaborators yet. Try inviting someone",
        });
        return;
      }
      res.json(collaborators);
    } catch (err) {
      console.log(err);
      res.status(500).send({ success: false, msg: "Internal server error" });
    }
  },
];

exports.document_delete_coll = [
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const userIDToBeDeleted = req.body.userid;
      const documentID = req.params.id;
      const document = await Documents.updateOne(
        { _id: documentID },
        {
          $pull: {
            collaborators: {
              user: userIDToBeDeleted,
            },
          },
        }
      );
      if (document.modifiedCount >= 1) {
        return next();
      }
      throw new Error("User not found");
    } catch (err) {
      console.log(err);
      res.status(500).send({ success: false, msg: "Internal server error" });
    }
  },
  async (req, res, next) => {
    // REMOVE DOCUMENT FROM INVITE ARRAY FOR THE USER WHOSE INVITE IS BEING REMOVED
    try {
      const userIDToBeDeleted = req.body.userid;
      const documentID = req.params.id;
      const userToBeRemovedInvite = await User.updateOne(
        { _id: userIDToBeDeleted },
        {
          $pull: {
            invites: {
              _id: documentID,
            },
            documents: {
              _id: documentID,
            },
          },
        }
      );
      const newUser = await User.findById(userIDToBeDeleted);
      if (userToBeRemovedInvite.modifiedCount >= 1) {
        sendNotification(userIDToBeDeleted, { type: "Invite" });
        return res.status(202).send({ success: true, msg: "User deleted" });
      }
      throw new Error("There was an error with the request");
    } catch (err) {
      res.status(500).send({ success: false, msg: "Internal server error" });
    }
  },
];

exports.document_display_invites = [
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const userID = req.user._id;
      const user = await User.findById(
        userID,
        "-invites.collaborators"
      ).populate({
        path: "invites",
        populate: { path: "author", select: "username" },
      });
      const userInvitedDocuments = user.invites;
      res.status(200).json(userInvitedDocuments);
    } catch (err) {
      console.log(err);
    }
  },
];

exports.document_accept_invite = [
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      // Modify collaborator status
      const userThatAccepted = req.user._id;
      const documentID = req.params.id;
      const updateStatus = await Documents.updateOne(
        { _id: documentID, "collaborators.user": userThatAccepted },
        { $set: { "collaborators.$.status": "active" } }
      );
      // Move the document from invites to accepted documents, so it can be displayed
      const updatedDocument = await Documents.findById(documentID);
      const user = await User.updateOne(
        { _id: userThatAccepted },
        {
          $pull: {
            invites: { _id: documentID },
          },
          $push: {
            documents: updatedDocument,
          },
        }
      );
      if (updateStatus.modifiedCount >= 1 && user.modifiedCount >= 1) {
        return res.status(200).send({ success: true });
      }
      throw new Error("Nothing was modified");
    } catch (err) {
      console.log(err);
      res.status(500).send({ success: false });
    }
  },
];

exports.document_decline_invite = [
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const userThatAccepted = req.user._id;
      const documentID = req.params.id;
      const deleteFromColl = await Documents.updateOne(
        { _id: documentID, "collaborators.user": userThatAccepted },
        { $pull: { collaborators: { user: userThatAccepted } } }
      );
      const user = await User.updateOne(
        { _id: userThatAccepted },
        {
          $pull: {
            invites: { _id: documentID },
          },
        }
      );
      if (deleteFromColl.modifiedCount >= 1 && user.modifiedCount >= 1) {
        return res.status(200).send({ success: true });
      }
      throw new Error("Nothing was modified");
    } catch (err) {
      res.status(500).send({ success: false });
    }
  },
];

exports.document_get_initial_state = [
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const documentID = req.params.id;
      const document = await Documents.findById(documentID, { content: 1 });
      res.json(document)
    } catch (err) {
      console.log(err);
      res.send({ success: false });
    }
  },
];