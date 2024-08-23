import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import './SigninForm.css';

const SigninForm = (props) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(['']);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const updateMessage = (msg) => {
    setMessage(msg);
  };

  const handleChange = (e) => {
    updateMessage('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await authService.signin(formData);
      props.setUser(user);
      navigate('/');
    } catch (err) {
      updateMessage(err.message);
    }
  };

  return (
    <main className="signin-main">
      <h1 className="signin-heading">Log In</h1>
      <p className="signin-message">{message}</p>
      <form autoComplete="off" onSubmit={handleSubmit} className="signin-form">
        <div className="signin-form-group">
          <label htmlFor="username" className="signin-form-label">Username:</label>
          <input
            type="text"
            autoComplete="off"
            id="username"
            value={formData.username}
            name="username"
            onChange={handleChange}
            className="signin-form-input"
          />
        </div>
        <div className="signin-form-group">
          <label htmlFor="password" className="signin-form-label">Password:</label>
          <input
            type="password"
            autoComplete="off"
            id="password"
            value={formData.password}
            name="password"
            onChange={handleChange}
            className="signin-form-input"
          />
        </div>
        <div className="signin-form-actions">
          <button type="submit" className="signin-form-button">Log In</button>
          <Link to="/" className="signin-form-link">
            <button type="button" className="signin-form-button">Cancel</button>
          </Link>
        </div>
      </form>
    </main>
  );
};

export default SigninForm;
