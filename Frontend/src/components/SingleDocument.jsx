import { useEffect, useState, useContext } from "react";
import api from "../api";
import { AppContext } from "../App";
import { Link, useParams } from "react-router-dom";

const SingleDocument = ({ title, documentID, handleSingleDelete, author }) => {
  const [modalActive, setModalActive] = useState(false);
  const { getUserID } = useContext(AppContext);
  const userID = getUserID();


  return (
    <div className="document" key={documentID}>
      <h4 className="document__title">{title}</h4>
      <div className="document__footer">
        <Link className="document__btn" to={`/document/${documentID}`}>
          <span className="document__text">Edit</span>
        </Link>
        {author === userID && (
          <div className="document__tooltip">
            <button
              className="document__btn"
              onClick={(e) => {
                setModalActive(true);
              }}
            >
              <span className="document__text">+</span>
            </button>
            <span className="document__tooltip-text">
              Collaborate with people
            </span>
          </div>
        )}
        {author === userID && (
          <button className="document__btn" onClick={handleSingleDelete}>
            <span className="document__text">delete</span>
          </button>
        )}
        {modalActive ? (
          <CollaborateModal
            setModalActive={setModalActive}
            documentID={documentID}
            modalActive={modalActive}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

const CollaborateModal = (props) => {
  const { setModalActive, documentID, modalActive } = props;
  const [resolveStatus, setResolveStatus] = useState({
    isThereAStatus: false,
    statusMsg: "",
  });
  const [inviteName, setInviteName] = useState("");
  const [allCollaborators, setAllCollaborators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState({ isError: false, msg: "" });

  const handleModalClose = (e) => {
    setModalActive(false);
    setResolveStatus({ isThereAStatus: false, statusMsg: "" });
  };

  const handleInputInviteChange = (e) => {
    setInviteName(e.target.value);
    setResolveStatus({
      isThereAStatus: false,
      statusMsg: "",
    });
  };

  const sendInvite = async () => {
    try {
      const response = await api.post("/documents/invite", {
        username: inviteName,
        documentID: documentID,
      });
      const friendName = inviteName;
      setResolveStatus({
        isThereAStatus: true,
        statusMsg: `Invite sent successfully to ${friendName}`,
      });
      getCollaborators();
    } catch (err) {
      setResolveStatus({
        isThereAStatus: true,
        statusMsg: `${err.response.data.msg}`,
      });
      console.log(err);
    } finally {
      setInviteName("");
    }
  };

  useEffect(() => {
    getCollaborators();
  }, []);

  const getCollaborators = async () => {
    try {
      let response = await api.get(`/documents/collaborators/${documentID}`);
      setAllCollaborators(response.data);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          setResolveStatus({
            isThereAStatus: true,
            statusMsg: `${err.response.data.msg}`,
          });
          return true;
        }
      }
      setError({
        isError: true,
        msg: `Internal server error`,
      });
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCollaborators = () => {
    if (error.isError) {
      return <>{error.msg}</>;
    } else if (isLoading) {
      return <>loading...</>;
    } else {
      return allCollaborators.map((collaborator) => (
        <ConfirmedFriend
          key={collaborator.user._id}
          name={collaborator.user.username}
          id={collaborator.user._id}
          status={collaborator.status}
          setAllCollaborators={setAllCollaborators}
          setResolveStatus={setResolveStatus}
          resolveStatus={resolveStatus}
          documentID={documentID}
        />
      ));
    }
  };

  return (
    <div className="modal__bg">
      <div className="collaborate modal__cont">
        <button
          className="collaborate__close modal__close"
          onClick={handleModalClose}
        >
          X
        </button>
        <h6 className="collaborate__title modal__title">Invite people</h6>
        <div className="collaborate__body">
          <input
            className="collaborate__input"
            onChange={handleInputInviteChange}
            value={inviteName}
          />
          <button className="collaborate__btn" onClick={sendInvite}>
            Invite
          </button>
          <p className="collaborate__result">{resolveStatus.statusMsg}</p>
        </div>
        <div className="collaborate__friends-cont">{renderCollaborators()}</div>
      </div>
    </div>
  );
};

const ConfirmedFriend = (props) => {
  const {
    setResolveStatus,
    resolveStatus,
    status,
    name,
    id,
    setAllCollaborators,
    documentID,
  } = props;

  const handleDelete = (e, id, name) => {
    setAllCollaborators((prevColl) => {
      const newColl = prevColl.filter((coll) => {
        return coll.user._id != id;
      });
      return newColl;
    });

    setResolveStatus({
      ...resolveStatus,
      statusMsg: `Deleted ${name} from project`,
      isThereAStatus: true,
    });
  };

  const handleAPIdelete = async (e, id, name, documentID) => {
    try {
      const response = await api.post(`/documents/collaborator/${documentID}`, {
        userid: id,
      });
      if (response.data.success) {
        handleDelete(e, id, name);
      }
    } catch (err) {
      console.log(err);
      setResolveStatus({
        ...resolveStatus,
        statusMsg: `There was an issue with deleting this user. Please try again later`,
        isThereAStatus: true,
      });
    }
  };

  return (
    <div
      className={`${
        status === "pending" ? "collaborate__pending" : "collaborate__friends"
      } `}
      key={id}
    >
      <span className="collaborate__name">{name}</span>
      {status === "pending" ? (
        <span className="collaborate__status">Pending...</span>
      ) : (
        ""
      )}
      <button
        className="collaborate__btn"
        onClick={(e) => handleAPIdelete(e, id, name, documentID)}
      >
        delete
      </button>
    </div>
  );
};

export default SingleDocument;
