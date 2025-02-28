import { Outlet, useNavigate } from "react-router-dom";
import HomeIMG from '../img/Homeimg.png'

const Home = ({ children }) => {
  const navigate = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    navigate("/about");
  };
  return (
    <section className="home">
      <div className="home-info-cont">
        <div className="home-info">
          <h1 className="title">Google Docs Clone</h1>
          <p className="description">
            Create new documents and collaborate with people in real time
          </p>
          <div className="home-info__btn-cont">
            <button className="home-info__btn" onClick={handleClick}>
              <span className="home-info__btn-text">Get Started</span>
            </button>
          </div>
        </div>
        <div className="home-info__img-cont">
          <img src={HomeIMG} className="home-info__img" />
        </div>
      </div>

      <div className="disclaimer">
        This is a personal project. Data here is not backed up. Please use at your
        own risk if you wish to continue
      </div>
      <footer className="footer">
        <button className="footer__btn">
          <a className="footer__text" href="https://github.com/LuisMCap">
            Github - github.com/LuisMCap
          </a>
        </button>
      </footer>
      {children ? children : ""}
    </section>
  );
};

export default Home;
