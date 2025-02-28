import { useState, useRef, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import DropdownNotification from "./DropdownNotification";
import api from "../api";
import { AppContext } from "../App";

const InviteNotification = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [dropdownActive, setDropdownActive] = useState(false);
  const btnRef = useRef(null);
  const { getUserID, socket } = useContext(AppContext);
  const userID = getUserID()

  const getInvites = async () => {
    try {
      const response = await api.get("/documents/invites");
      if (response.status === 200) {
        setNotifications(response.data);
        console.log(response.data);
      }
    } catch (err) {
      console.log(err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    socket.emit("register", userID);

    socket.on("notification", (message) => {
      getInvites()
    });

    return () => {
      socket.off("notification");
    };
  }, [userID]);

  useEffect(() => {
    getInvites();
  }, []);

  const handleNotificationClick = (e) => {
    setDropdownActive(!dropdownActive ? true : false);
  };

  const documentAcceptedOrDeleted = (documentID) =>{
    setNotifications(prevNot=>{
      const newNotifications = prevNot.filter(notification=>{
        return notification._id != documentID
      })
      return newNotifications
    })
  }

  if (isError) {
    return <></>;
  }
  if (isLoading) {
    return <></>;
  }
  return (
    <>
      <button
        ref={btnRef}
        className="header__btn header__notification-active"
        onClick={handleNotificationClick}
      >
        {notifications.length >= 1 ? (
          <div className="header__notification">{notifications.length}</div>
        ) : (
          ""
        )}
        <FontAwesomeIcon className="header__icon" icon={faBell} />
      </button>
      {dropdownActive && (
        <DropdownNotification
          setDropdownActive={setDropdownActive}
          ref={btnRef}
          notifications={notifications}
          documentAcceptedOrDeleted={documentAcceptedOrDeleted}
        />
      )}
    </>
  );
};

export default InviteNotification