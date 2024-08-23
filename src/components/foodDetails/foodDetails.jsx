import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

// Services
import restaurantService from "../../services/restaurantService";
import commentService from "../../services/commentService";
import { Link } from "react-router-dom";

// Components
import CommentForm from "../CommentForm/CommentForm";
import './foodDetails.css';

const FoodDetails = (props) => {
  const { restaurantId, foodId } = useParams();

  const [food, setFood] = useState(null);
  const [restaurant, setRestaurant] = useState(props.selectedRestaurant);

  useEffect(() => {
    async function getFood() {
      const foodData = await restaurantService.showFood(restaurantId, foodId);
      setFood(foodData);
    }
    getFood();
  }, [foodId, restaurantId]);

  const handleAddComment = async (formData) => {
    const newComment = await commentService.createFC(
      restaurantId,
      foodId,
      formData
    );

    setFood(prevFood => ({
      ...prevFood,
      comments: [...prevFood.comments, newComment]
    }));
  };

  const handleDeleteComment = async (commentId) => {
    await commentService.deleteFoodComment(restaurantId, foodId, commentId);
    setFood(prevFood => ({
      ...prevFood,
      comments: prevFood.comments.filter(comment => comment._id !== commentId)
    }));
  };

  const handleDeleteClick = () => {
    props.handleDeleteFood(restaurantId, food._id);
  };

  if (!food) {
    return <main className="loading">Loading...</main>;
  }

  return (
    <div className="food-details">
      <div className="food-header">
        <h4 className="food-name">{food.name}</h4>
        <ul className="food-info">
          <li><strong>Dish Type:</strong> {food.type}</li>
          <li><strong>Description:</strong> {food.description}</li>
          <li><strong>Price:</strong> ${food.price}</li>
        </ul>
        {props.user.id === restaurant.owner && (
          <div className="food-actions">
            <Link to={`/restaurants/${restaurantId}/menu/${foodId}/edit`} className="edit-link">Edit</Link>
            <button onClick={handleDeleteClick} className="delete-button">Delete Food</button>
          </div>
        )}
      </div>

      <div className="comments-section">
        {food.comments.length === 0 ? (
          <div className="no-comments">
            <h4>No comments yet</h4>
            <CommentForm handleAddComment={handleAddComment} />
          </div>
        ) : (
          <div className="comments-list">
            <h4>Comments:</h4>
            <CommentForm handleAddComment={handleAddComment} />
            {food.comments.map((comment) => (
              <div key={comment._id} className="comment">
                <form
                  className="comment-form"
                  id={comment._id}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleDeleteComment(comment._id);
                  }}
                >
                  <p>
                    <strong>{comment.authorName}</strong>: {comment.text}
                  </p>
                  {comment.authorId === props.user.id && (
                    <button type="submit" className="delete-comment-button">Delete</button>
                  )}
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDetails;
