import { FaReact } from "react-icons/fa";

const About = () => {
  const listElements = [
    "Create a new account and log in",
    "Create new documents",
    "Invite multiple to collaborate with you in real time",
    "Receive notifications in real time to collaborate with other people",
  ];

  const technologies = [
    "React - Frontend",
    "MongoDB - DB",
    "SOCKET.io - Real-time collaboration",
    "Express - Backend",
    "JWT - Authorization and Authentication",
    "TipTap - Editor",
  ];

  return (
    <section className="about">
      <h3 className="about__title">About</h3>
      <p className="about__text">
        Google docs clone where you can easily colaborate with other people. You
        can:
      </p>
      <ul className="about__list">
        {listElements.map((element) => {
          return <li className="about__list-element">{element}</li>;
        })}
      </ul>
      <h5 className="about__subtitle">Testing accounts</h5>
      <p className="about__text">
        Create a new account or use the two testing accounts
      </p>
      <ul className="about__list">
        <li className="about__list-element">Usernames: Testing1 | Testing2</li>
        <li className="about__list-element">Password: 123</li>
      </ul>
      <h5 className="about__subtitle">Technologies used</h5>
      <ul className="about__list">
        {technologies.map((element) => {
          return <li className="about__list-element">{element}</li>;
        })}
      </ul>
    </section>
  );
};

export default About;
