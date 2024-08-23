import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import restaurantService from "../../services/restaurantService";
import './EditFoodForm.css';

const EditFoodForm = ({ handleUpdateFood }) => {
  const { restaurantId, foodId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    type: "Appetizer",
    description: "",
    price: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFood() {
      try {
        const food = await restaurantService.showFood(restaurantId, foodId);
        setFormData({
          name: food.name,
          type: food.type,
          description: food.description,
          price: food.price,
        });
      } catch (error) {
        console.error("Error fetching food data:", error);
      }
    }
    fetchFood();
  }, [restaurantId, foodId]);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      await handleUpdateFood(restaurantId, foodId, formData);
      navigate(`/restaurants/${restaurantId}/menu/${foodId}`);
    } catch (error) {
      console.error("Error updating food:", error);
    }
  };

  return (
    <div className="edit-food-form-container">
      <main className="edit-food-form-main">
        <form onSubmit={handleSubmit} className="edit-food-form">
          <div className="form-group">
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
          </div>

          <div className="form-group">
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
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
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
            <label htmlFor="price">Price:</label>
            <input
              required
              type="number"
              step="0.01"
              name="price"
              id="price"
              value={formData.price}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <button type="submit" className="submit-button">Update Food</button>
        </form>
      </main>
    </div>
  );
};

export default EditFoodForm;
