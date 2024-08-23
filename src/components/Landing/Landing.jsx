import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">Hello, you are on the landing page for visitors.</h1>
        <h3 className="landing-subtitle">
          If you sign up for a new account, you will have the ability to sign in
          and see your super secret dashboard.
        </h3>
      </div>
    </div>
  );
};

export default Landing;
