import { useContext, useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import MenuBar from "../components/Tiptap";
import TiptapExtentions from "../utils/TiptapExtentions";
import { useParams } from "react-router-dom";
import api from "../api";
import { AppContext } from "../App";

const Document = (props) => {
  const { documentID } = useParams();
  const { content, setContent } = props;
  const { socket } = useContext(AppContext);

  const editor = useEditor({
    extensions: TiptapExtentions,
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
      socket.emit("collaborate", { documentID: documentID, content: html });
    }
  });

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("join", documentID);
    });

    socket.on("collaborate", (data) => {
      if (data && editor) {
        editor.commands.setContent(data, false);
      }
    });

    return () => {
      socket.off("collaborate");
    };
  }, [editor, documentID]);

  return (
    <section className="canvas">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </section>
  );
};

export default Document;
