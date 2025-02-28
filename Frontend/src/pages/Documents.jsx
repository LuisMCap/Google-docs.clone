import { useEffect, useState, useContext } from "react";
import SingleDocument from "../components/SingleDocument";
import api from "../api";
import { AppContext } from "../App";
import { Link } from "react-router-dom";

const Documents = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState({ msg: "", isError: false, errorCode: ''});
  const { newDocumentToggle } = useContext(AppContext);

  const getDocuments = async () => {
    try {
      let response = await api("/documents");
      if (response.status === 200) {
        setDocuments(response.data);
        setError({ msg: "", isError: false });
      }
    } catch (err) {
      let errorMsg = "There was an error with the request...";
      if (err.response) {
        if (err.response.status === 404) {
          setError({
            msg: '',
            isError: true,
            errorCode: 404
          });
          return
        }
      }
      setError({
        msg: errorMsg,
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDocuments();
  }, [newDocumentToggle]);

  const handleSingleDelete = async (documentID) => {
    try {
      let response = await api.delete(`/documents/${documentID}`);
      if (response.status === 200) {
        setDocuments((prevDoc) => {
          const newDocuments = prevDoc.filter((document) => {
            return document._id != documentID;
          });
          return newDocuments;
        });
      }
    } catch (err) {
      setError({
        msg: "There was an error with deleting this item. Please load the page and try again",
        isError: true,
      });
    }
  };

  if (isLoading) {
    return (
      <section className="documents">
        <p className="documents__error">loading...</p>
      </section>
    );
  }

  if (error.isError && error.errorCode != 404) {
    return (
      <section className="documents">
        <p className="documents__error">{error.msg}</p>
        {children ? children : ""}
      </section>
    );
  }

  if (documents.length === 0) {
    return (
      <section className="documents">
        <p className="documents__error">
          You don't have any documents.{" "}
          <Link className="documents__alternative" to={'/documents/createDocument'}>
            Click here to create one.
          </Link>
        </p>
        {children ? children : ""}
      </section>
    );
  }

  return (
    <section className="documents">
      <h2 className="documents__title">All documents</h2>
      <div className="documents__cont">
        {documents.map((document) => {
          return (
            <SingleDocument
              author={document.author}
              title={document.title}
              documentID={document._id}
              handleSingleDelete={() => handleSingleDelete(document._id)}
            />
          );
        })}
      </div>
      {children ? children : ""}
    </section>
  );
};

export default Documents;
