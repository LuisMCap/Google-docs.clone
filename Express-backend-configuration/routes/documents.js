const document_controller = require("../controllers/documentsController");

const router = require("express").Router();

router.get("/", document_controller.document_get);
router.post("/create", document_controller.document_create);
router.delete("/:id", document_controller.document_delete);
router.post("/invite", document_controller.document_send_invite);
router.get(
  "/collaborators/:id",
  document_controller.document_display_collaborators
);
router.post("/collaborator/:id", document_controller.document_delete_coll);
router.get("/invites", document_controller.document_display_invites);
router.patch("/accept/:id", document_controller.document_accept_invite);
router.patch('/decline/:id', document_controller.document_decline_invite)
router.get('/:id', document_controller.document_get_initial_state)

module.exports = router;
