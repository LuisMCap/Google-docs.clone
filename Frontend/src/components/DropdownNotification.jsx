import React, {useState, useRef, useEffect, useContext} from "react";
import api from "../api";
import { AppContext } from "../App";

const DropdownNotification = React.forwardRef((props, ref) => {
  const { setDropdownActive, notifications, documentAcceptedOrDeleted } = props;
  const dropdownRef = useRef();

  const clickOutside = (e) => {
    if (
      !dropdownRef.current ||
      dropdownRef.current.contains(e.target) ||
      !ref.current ||
      ref.current.contains(e.target)
    ) {
      return;
    }
    setDropdownActive(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", clickOutside);
    return () => {
      document.removeEventListener("mousedown", clickOutside);
    };
  }, []);

  return (
    <div className="notification-cont" ref={dropdownRef}>
      {notifications.map((notification) => (
        <Notifications
          key={notification._id}
          documentID={notification._id}
          documentAuthor={notification.author.username}
          documentName={notification.title}
          documentAcceptedOrDeleted={documentAcceptedOrDeleted}
        />
      ))}
    </div>
  );
});

const Notifications = (props) => {
  const { toggleDocument } = useContext(AppContext);
  const {
    documentAuthor,
    documentName,
    documentID,
    documentAcceptedOrDeleted,
  } = props;

  const acceptInvite = async (e) => {
    try {
      const response = await api.patch(`/documents/accept/${documentID}`);
      console.log(response);
      if (response.status === 200) {
        documentAcceptedOrDeleted(documentID)
        toggleDocument()
      }
    } catch (err) {
      console.log(err);
    }
  };

  const declineInvite = async (e) => {
    try {
      const response = await api.patch(`/documents/decline/${documentID}`);
      console.log(response);
      if (response.status === 200) {
        documentAcceptedOrDeleted(documentID);
        toggleDocument();
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="notification">
      <h6 className="notification__title">
        <span className="capitalize">{documentAuthor}</span> wants to
        collaborate with you in
        <span className="emphasize capitalize"> {documentName}</span>
      </h6>
      <div className="notification__btn-cont">
        <button
          className="notification__btn notification__accept"
          onClick={acceptInvite}
        >
          Accept
        </button>
        <button className="notification__btn notification__decline" onClick={declineInvite}>
          Decline
        </button>
      </div>
    </div>
  );
};

export default DropdownNotification