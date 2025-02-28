import React from "react";
import Sidebar from "./Sidebar";
import api from "../api";

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const getDocuments = async () => {
    try {
      let response = await api.get("/documents");
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleclick = () => {
    getDocuments();
  };

  return <Sidebar editor={editor} handleclick={handleclick} />;
};

export default MenuBar;
