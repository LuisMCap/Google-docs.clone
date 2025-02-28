import { useNavigate, Link } from "react-router-dom";

const Form = (props) => {
  const {
    title,
    handleInputChange,
    btnText,
    handleSubmit,
    accountPrompt,
    alternative,
    whereToAlternative,
    form
  } = props;
  const Navigate = useNavigate();

  const closeModal = () => {
    Navigate("/");
  };

  return (
    <>
      <div className="modal-header">
        <button className="modal-btn" onClick={closeModal}>
          <span className="modal-icon">X</span>
        </button>
      </div>
      <div className="form-cont">
        <h3 className="modal-title">{title}</h3>
        <form className="log-form">
          <label className="log-form__label" htmlFor="username">
            Username
          </label>
          <input
            className="log-form__input"
            name="username"
            onChange={handleInputChange}
            value={form.username}
          />
          <label className="log-form__label" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            className="log-form__input"
            name="password"
            onChange={handleInputChange}
            value={form.password}
          />
          <button className="log-form__btn" onClick={handleSubmit}>
            {btnText}
          </button>
        </form>
        <div className="log-form__account">
          {accountPrompt}
          <Link className="log-form__alternative" to={whereToAlternative}>
            {alternative}
          </Link>
        </div>
      </div>
    </>
  );
};

export default Form;
