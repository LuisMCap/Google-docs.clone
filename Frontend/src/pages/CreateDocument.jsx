import { useState, useContext } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";

const CreateDocument = () => {
  const Navigate = useNavigate()
  const [form, setForm] = useState({ title: "" });
  const [resolveStatus, setResolveStatus] = useState('')
  const { toggleDocument } = useContext(AppContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const catchFormError = formError();
    if (catchFormError) {
      setResolveStatus(catchFormError)
      return;
    }
    postRequest();
    setResolveStatus('')
  };

  const postRequest = async () => {
    try {
      let response = await api.post("documents/create", form);
      console.log(response);
      toggleDocument()
      setResolveStatus('Document created successfully!')
    } catch (err) {
      setResolveStatus("There was a problem trying to create this document. Please try again later.");
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setResolveStatus("");
  };

  const formError = (e) => {
    if (!form.title) {
      return 'Please fill out everything in the form'
    }
    return false
  };

  const handleCloseModal = () =>{
    Navigate('/documents')
  }

  return (
    <div className="modal__bg">
      <section className="create-document modal__cont">
        <button className="modal__close create-document__close" onClick={handleCloseModal}>X</button>
        <h6 className="modal__title create-document__title">Create document</h6>
        <form className="create-document__form">
          <input
            name="title"
            onChange={handleChange}
            value={form.title}
            className="create-document__input"
          />
          <button
            type="submit"
            onClick={handleSubmit}
            className="create-document__btn"
          >
            Submit
          </button>
          <p className="create-document__result">{resolveStatus}</p>
        </form>
      </section>
    </div>
  );
};

export default CreateDocument;
