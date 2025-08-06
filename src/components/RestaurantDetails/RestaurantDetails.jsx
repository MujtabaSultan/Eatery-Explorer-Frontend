import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FoodDetails from "../foodDetails/foodDetails";
// Services
import restaurantService from "../../services/restaurantService";
import commentService from "../../services/commentService";
import "./RestaurantDetails.css";
// Components
import AuthorDate from "../common/AuthorDate";
import CommentForm from "../CommentForm/CommentForm";

const RestaurantDetails = (props) => {
  const { restaurantsId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [comment, setComment] = useState(null);
  const navigate = useNavigate();

  async function getRestaurant() {
    const restaurantData = await restaurantService.show(restaurantsId);
    // console.log(restaurantData);
    setRestaurant(restaurantData);
    setComment(restaurantData.comments);
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

  const handlesubmitC = async (e) => {
    e.preventDefault();
    // const res = await restaurantService.deleter(restaurantsId);
    // console.log(res);
    // props.setRestId(null);
    await props.handleDeleteRestaurant(restaurantsId);
    //navigate(`restaurants/owner/${props.user.id}`);
  };

  const handlesubmitDelete = async (e) => {
    e.preventDefault();
    handleDeleteComment(restaurantsId, e.target.id);

    const newRes = restaurant.comments.filter(
      (comment) => comment._id !== e.target.id
    );

    const updateRestaurant = { ...restaurant, comments: newRes };
    setRestaurant(updateRestaurant);

    //setRestaurant(newRes);
  };
  const handleDeleteComment = async (rId, commentId) => {
    commentService.deleteC(rId, commentId);

    // await props.handleDeleteRestaurant(restaurantsId);
    // navigate(`/owners/${props.user.id}`);
  };

  if (!restaurant) {
    return (
      <div className="loading">
        <h3>Loading...</h3>
      </div>
    );
  }

  // console.log(restaurant);
  return (
    <main className="restaurant-details">
      <header className="restaurant-header">
        <h1 className="restaurant-name">{restaurant.name.toUpperCase()}</h1>
        <h2 className="restaurant-type">{restaurant.type}</h2>
        <h3 className="restaurant-description">
          Description: {restaurant.describtion}
        </h3>
        <h3 className="restaurant-location">Location: {restaurant.location}</h3>
        <h3 className="restaurant-cuisine">Cuisine: {restaurant.cuisine}</h3>
      </header>

      <div className="menu-section">
        {restaurant.menu.filter((item) => item.type === "Main Course").length >
        0 ? (
          <div className="menu-category">
            <h3>Main Courses: </h3>
            <ul>
              {restaurant.menu
                .filter((item) => item.type === "Main Course")
                .map((item) => (
                  <li key={item._id}>
                    <Link
                      to={`/restaurants/${restaurant._id}/menu/${item._id}`}
                      className="menu-item-link"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ) : null}

        {restaurant.menu.filter((item) => item.type === "Appetizer").length >
        0 ? (
          <div className="menu-category">
            <h3>Appetizers: </h3>
            <ul>
              {restaurant.menu
                .filter((item) => item.type === "Appetizer")
                .map((item) => (
                  <li key={item._id}>
                    <Link
                      to={`/restaurants/${restaurant._id}/menu/${item._id}`}
                      className="menu-item-link"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ) : null}

        {restaurant.menu.filter((item) => item.type === "Dessert").length >
        0 ? (
          <div className="menu-category">
            <h3>Desserts: </h3>
            <ul>
              {restaurant.menu
                .filter((item) => item.type === "Dessert")
                .map((item) => (
                  <li key={item._id}>
                    <Link
                      to={`/restaurants/${restaurant._id}/menu/${item._id}`}
                      className="menu-item-link"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ) : null}

        {restaurant.menu.filter((item) => item.type === "Beverage").length >
        0 ? (
          <div className="menu-category">
            <h3>Beverages: </h3>
            <ul>
              {restaurant.menu
                .filter((item) => item.type === "Beverage")
                .map((item) => (
                  <li key={item._id}>
                    <Link
                      to={`/restaurants/${restaurant._id}/menu/${item._id}`} className="menu-item-link"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="actions">
        {props.user.id === restaurant.owner && (
          <Link
            to={`/restaurants/${restaurant._id}/edit`}
            className="action-link"
          >
            Edit Restaurant
          </Link>
        )}

        {props.user.id === restaurant.owner && (
          <Link
            to={`/restaurants/${restaurant._id}/add-food`}
            className="action-link"
          >
            Add Food
          </Link>
        )}

        {props.user.id === restaurant.owner ? (
          <form onSubmit={handlesubmitC} action="" className="delete-form">
            <button type="submit" className="action-button">
              delete the restaurant
            </button>
          </form>
        ) : null}
      </div>

      <section className="comments-section">
        <h2>Comments on {restaurant.name}:</h2>
        <CommentForm handleAddComment={handleAddComment} />
        {restaurant.comments.length === 0 ? (
          <p>There are no comments.</p>
        ) : (
          restaurant.comments.map((comment) => (
            <div key={comment._id} className="comment">
              <form action="" id={comment._id} onSubmit={handlesubmitDelete}>
                <p>
                  <b>{comment.authorName}</b>: {comment.text}
                </p>

                {comment.authorId === props.user.id ? (
                  <button type="submit" className="delete-comment-button">
                    delete
                  </button>
                ) : null}
              </form>
            </div>
          ))
        )}
      </section>
    </main>
  );
};

export default RestaurantDetails;
