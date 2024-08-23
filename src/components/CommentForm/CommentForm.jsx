import { useState } from 'react';
import './CommentForm.css';

const CommentForm = ({ handleAddComment }) => {
  const [formData, setFormData] = useState({ text: '' });

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    handleAddComment(formData);
    setFormData({ text: '' });
  };

  return (
    <div className="comment-form-container">
      <form onSubmit={handleSubmit} className="comment-form">
        <div className="form-group">
          <label htmlFor="text-input">Comment:</label>
          <textarea
            required
            name="text"
            id="text-input"
            value={formData.text}
            onChange={handleChange}
            className="comment-textarea"
          />
        </div>
        <button type="submit" className="submit-button">SUBMIT COMMENT</button>
      </form>
    </div>
  );
};

export default CommentForm;
