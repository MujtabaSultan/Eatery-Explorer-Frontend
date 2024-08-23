import { useState } from 'react';
import './RestaurantForm.css';

const RestaurantForm = ({ handleAddRestaurant }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    cuisine: 'italian',
  });

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    handleAddRestaurant(formData);
  };

  return (
    <main className="restaurant-form">
      <form onSubmit={handleSubmit} className="restaurant-form-container">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Name:</label>
          <input
            required
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description" className="form-label">Description:</label>
          <textarea
            required
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location" className="form-label">Location:</label>
          <input
            required
            type="text"
            name="location"
            id="location"
            value={formData.location}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="cuisine" className="form-label">Cuisine:</label>
          <select
            required
            name="cuisine"
            id="cuisine"
            value={formData.cuisine}
            onChange={handleChange}
            className="form-select"
          >
            <option value="italian">Italian</option>
            <option value="indian">Indian</option>
            <option value="persian">Persian</option>
            <option value="arabian">Arabian</option>
            <option value="japanese">Japanese</option>
            <option value="mexican">Mexican</option>
          </select>
        </div>

        <button type="submit" className="submit-button">Submit</button>
      </form>
    </main>
  );
};

export default RestaurantForm;
