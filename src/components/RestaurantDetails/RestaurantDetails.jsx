import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import restaurantService from "../../services/restaurantService";
import commentService from "../../services/commentService";
import CommentForm from "../CommentForm/CommentForm";
import './RestaurantDetails.css';

const RestaurantDetails = (props) => {
  const { restaurantsId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const navigate = useNavigate();

  async function getRestaurant() {
    const restaurantData = await restaurantService.show(restaurantsId);
    setRestaurant(restaurantData);
    props.setRestId(restaurantsId);
    props.setSelectedRestaurant(restaurantData);
  }

  useEffect(() => {
    getRestaurant();
  }, [restaurantsId]);

  const handleAddComment = async (formData) => {
    const newComment = await commentService.create(restaurantsId, formData);
    setRestaurant((prevRestaurant) => ({
      ...prevRestaurant,
      comments: [...prevRestaurant.comments, newComment],
    }));
  };

  const handleDeleteRestaurant = async (e) => {
    e.preventDefault();
    await props.handleDeleteRestaurant(restaurantsId);
    navigate(`/restaurants/owner/${props.user.id}`);
  };

  const handleDeleteComment = async (commentId) => {
    await commentService.deleteC(restaurantsId, commentId);
    setRestaurant((prevRestaurant) => ({
      ...prevRestaurant,
      comments: prevRestaurant.comments.filter((comment) => comment._id !== commentId),
    }));
  };

  if (!restaurant) {
    return (
      <div className="loading">
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <main className="restaurant-details">
      <header className="restaurant-header">
        <h1 className="restaurant-name">{restaurant.name.toUpperCase()}</h1>
        <h2 className="restaurant-type">{restaurant.type}</h2>
        <h3 className="restaurant-description">Description: {restaurant.description}</h3>
        <h3 className="restaurant-location">Location: {restaurant.location}</h3>
        <h3 className="restaurant-cuisine">Cuisine: {restaurant.cuisine}</h3>
      </header>

      <div className="menu-section">
        {restaurant.menu.filter((item) => item.type === "Main Course").length > 0 && (
          <div className="menu-category">
            <h3>Main Courses:</h3>
            <ul>
              {restaurant.menu
                .filter((item) => item.type === "Main Course")
                .map((item) => (
                  <li key={item._id}>
                    <Link to={`/restaurants/${restaurant._id}/menu/${item._id}`} className="menu-item-link">
                      {item.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        )}
        {restaurant.menu.filter((item) => item.type === "Appetizer").length > 0 && (
          <div className="menu-category">
            <h3>Appetizers:</h3>
            <ul>
              {restaurant.menu
                .filter((item) => item.type === "Appetizer")
                .map((item) => (
                  <li key={item._id}>
                    <Link to={`/restaurants/${restaurant._id}/menu/${item._id}`} className="menu-item-link">
                      {item.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        )}
        {restaurant.menu.filter((item) => item.type === "Dessert").length > 0 && (
          <div className="menu-category">
            <h3>Desserts:</h3>
            <ul>
              {restaurant.menu
                .filter((item) => item.type === "Dessert")
                .map((item) => (
                  <li key={item._id}>
                    <Link to={`/restaurants/${restaurant._id}/menu/${item._id}`} className="menu-item-link">
                      {item.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        )}
        {restaurant.menu.filter((item) => item.type === "Beverage").length > 0 && (
          <div className="menu-category">
            <h3>Beverages:</h3>
            <ul>
              {restaurant.menu
                .filter((item) => item.type === "Beverage")
                .map((item) => (
                  <li key={item._id}>
                    <Link to={`/restaurants/${restaurant._id}/menu/${item._id}`} className="menu-item-link">
                      {item.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>

      <div className="actions">
        {props.user.id === restaurant.owner && (
          <>
            <Link to={`/restaurants/${restaurant._id}/edit`} className="action-link">Edit Restaurant</Link>
            <Link to={`/restaurants/${restaurant._id}/add-food`} className="action-link">Add Food</Link>
            <form onSubmit={handleDeleteRestaurant} className="delete-form">
              <button type="submit" className="action-button">Delete Restaurant</button>
            </form>
          </>
        )}
      </div>

      <section className="comments-section">
        <h2>Comments on {restaurant.name.toUpperCase()}:</h2>
        <CommentForm handleAddComment={handleAddComment} />
        {restaurant.comments.length === 0 ? (
          <p>There are no comments.</p>
        ) : (
          restaurant.comments.map((comment) => (
            <div key={comment._id} className="comment">
              <form onSubmit={(e) => {
                e.preventDefault();
                handleDeleteComment(comment._id);
              }}>
                <p>
                  <b>{comment.authorName}</b>: {comment.text}
                </p>
                {comment.authorId === props.user.id && (
                  <button type="submit" className="delete-comment-button">Delete</button>
                )}
              </form>
            </div>
          ))
        )}
      </section>
    </main>
  );
};

export default RestaurantDetails;
