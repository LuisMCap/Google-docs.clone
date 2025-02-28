import { useParams } from "react-router-dom";
import Document from "./Document";
import { useEffect, useState } from "react";
import api from "../api";

const DocumentCont = () => {
  const { documentID } = useParams();
  const [content, setContent] = useState("hello");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setIsError] = useState(false)

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await api.get(`documents/${documentID}`);
        if (response.data.content) {
          setContent(response.data.content);
        }
      } catch (error) {
        console.error("Error fetching document:", error);
        setIsError(true)
      }finally {
        setIsLoading(false)
      }
    };

    fetchDocument();
  }, [documentID]);

  if (isLoading) {
    return (<div>loading...</div>)
  }

  if (error) {
    return (<div>There was an error with the request...</div>)
  }

  if (!isLoading) {
    return (
      <>
        <Document content={content} setContent={setContent} />
      </>
    );
  }
};

export default DocumentCont;
