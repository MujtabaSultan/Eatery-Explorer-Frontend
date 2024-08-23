import { useState } from 'react';
import { useParams } from 'react-router-dom';
import './AddFoodForm.css'; // Import the CSS file

const AddFoodForm = ({ handleAddFood }) => {
  const { restaurantId } = useParams(); 
  const [formData, setFormData] = useState({
    name: '',
    type: 'Appetizer',
    description: '',
    price: '',
  });

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    handleAddFood(restaurantId, formData); 
  };

  return (
    <main>
      <form onSubmit={handleSubmit} className="add-food-form">
        <label htmlFor="name">Food Name:</label>
        <input
          required
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          className="form-input"
        />
        
        <label htmlFor="type">Type:</label>
        <select
          required
          name="type"
          id="type"
          value={formData.type}
          onChange={handleChange}
          className="form-select"
        >
          <option value="Appetizer">Appetizer</option>
          <option value="Main Course">Main Course</option>
          <option value="Dessert">Dessert</option>
          <option value="Beverage">Beverage</option>
        </select>

        <label htmlFor="description">Description:</label>
        <textarea
          required
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          className="form-textarea"
        />
        
        <label htmlFor="price">Price:</label>
        <input
          required
          type="number"
          name="price"
          id="price"
          value={formData.price}
          onChange={handleChange}
          className="form-input"
        />

        <button type="submit" className="submit-button">Add Food</button>
      </form>
    </main>
  );
};

export default AddFoodForm;
