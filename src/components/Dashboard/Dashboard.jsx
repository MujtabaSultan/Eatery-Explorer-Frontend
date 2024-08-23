import './Dashboard.css';

const Dashboard = ({ user }) => {
  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <h1 className="welcome-message">Welcome, {user.username}</h1>
        <p className="dashboard-description">
          Here's a complete list of restaurants, including their details and the specifics of each one's menu. You can view all the restaurants through the navigation, or create your own restaurants and view them through your profile.
        </p>
      </main>
    </div>
  );
};

export default Dashboard;
