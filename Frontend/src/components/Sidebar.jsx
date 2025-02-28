const Sidebar = ({editor, handleclick}) =>{
    return (
      <div className="sidebar">
        <div className="sidebar__tags-cont">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="sidebar__tag"
          >
            undo
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="sidebar__tag"
          >
            redo
          </button>
        </div>
        <div className="sidebar__tags-cont">
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`${
              editor.isActive("paragraph") ? "sidebar__is-active" : ""
            } sidebar__tag`}
          >
            paragraph
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`${
              editor.isActive("heading", { level: 2 })
                ? "sidebar__is-active"
                : ""
            } sidebar__tag`}
          >
            h2
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`${
              editor.isActive("heading", { level: 3 })
                ? "sidebar__is-active"
                : ""
            } sidebar__tag`}
          >
            h3
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            className={`${
              editor.isActive("heading", { level: 4 })
                ? "sidebar__is-active"
                : ""
            } sidebar__tag`}
          >
            h4
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 5 }).run()
            }
            className={`${
              editor.isActive("heading", { level: 5 })
                ? "sidebar__is-active"
                : ""
            } sidebar__tag`}
          >
            h5
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 6 }).run()
            }
            className={`${
              editor.isActive("heading", { level: 6 })
                ? "sidebar__is-active"
                : ""
            } sidebar__tag`}
          >
            h6
          </button>
        </div>
        <div className="sidebar__tags-cont">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`${
              editor.isActive("bold") ? "sidebar__is-active" : ""
            } sidebar__tag`}
          >
            bold
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`${
              editor.isActive("italic") ? "sidebar__is-active" : ""
            } sidebar__tag`}
          >
            italic
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={`${
              editor.isActive("strike") ? "sidebar__is-active" : ""
            } sidebar__tag`}
          >
            strike
          </button>
          <button
            onClick={() => editor.chain().focus().setColor("#958DF1").run()}
            className={`${
              editor.isActive("textStyle", { color: "#958DF1" })
                ? "sidebar__is-active"
                : ""
            } sidebar__tag`}
          >
            purple
          </button>
        </div>
        <div className="sidebar__tags-cont">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`${
              editor.isActive("bulletList") ? "sidebar__is-active" : ""
            } sidebar__tag`}
          >
            bullet list
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`${
              editor.isActive("orderedList") ? "sidebar__is-active" : ""
            } sidebar__tag`}
          >
            ordered list
          </button>
        </div>
        {/* 
      <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear marks
      </button>
      <button onClick={() => editor.chain().focus().clearNodes().run()}>
        clear nodes
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("codeBlock") ? "sidebar__is-active" : ""}
      >
        code block
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "sidebar__is-active" : ""}
      >
        blockquote
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        horizontal rule
      </button>
      <button onClick={() => editor.chain().focus().setHardBreak().run()}>
        hard break
      </button> */}
      </div>
    );
}

export default Sidebar