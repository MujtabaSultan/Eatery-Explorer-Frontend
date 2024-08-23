import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import './SignupForm.css';

const SignupForm = (props) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(['']);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConf: '',
  });

  const updateMessage = (msg) => {
    setMessage(msg);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      updateMessage('');
      const newUserResponse = await authService.signup(formData);
      props.setUser(newUserResponse.user);
      navigate('/');
    } catch (err) {
      updateMessage(err.message);
    }
  };

  const { username, password, passwordConf } = formData;

  const isFormInvalid = () => {
    return !(username && password && password === passwordConf);
  };

  return (
    <main className="signup-main">
      <h1 className="signup-heading">Sign Up</h1>
      <p className="signup-message">{message}</p>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="signup-form-group">
          <label htmlFor="username" className="signup-form-label">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            name="username"
            onChange={handleChange}
            className="signup-form-input"
          />
        </div>
        <div className="signup-form-group">
          <label htmlFor="password" className="signup-form-label">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            name="password"
            onChange={handleChange}
            className="signup-form-input"
          />
        </div>
        <div className="signup-form-group">
          <label htmlFor="confirm" className="signup-form-label">Confirm Password:</label>
          <input
            type="password"
            id="confirm"
            value={passwordConf}
            name="passwordConf"
            onChange={handleChange}
            className="signup-form-input"
          />
        </div>
        <div className="signup-form-actions">
          <button type="submit" className="signup-form-button" disabled={isFormInvalid()}>Sign Up</button>
          <Link to="/" className="signup-form-link">
            <button type="button" className="signup-form-button">Cancel</button>
          </Link>
        </div>
      </form>
    </main>
  );
};

export default SignupForm;
