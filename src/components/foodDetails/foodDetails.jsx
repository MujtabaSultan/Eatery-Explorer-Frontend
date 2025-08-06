import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./foodDetails.css";
// Services
import restaurantService from "../../services/restaurantService";
import commentService from "../../services/commentService";
import { Link } from "react-router-dom";
// Components
import AuthorDate from "../common/AuthorDate";
import CommentForm from "../CommentForm/CommentForm";

const foodDetails = (props) => {
  const { restaurantId, foodId } = useParams();

  const [food, setFood] = useState(null);
  const [restoId, setRestoId] = useState(null);
  const [restaurant, setRestaurant] = useState(props.selectedRestaurant);
  const [tempres, setTempres] = useState();

  // async function getRestaurant() {
  //   const restaurantData = await restaurantService.show(restaurantId);
  //   // console.log(restaurantData);
  //   setRestaurant(restaurantData);
  //   // setComment(restaurantData.comments);
  //   // props.setRestId(restaurantsId);
  // }

  useEffect(() => {
    async function getFood() {
      const foodData = await restaurantService.showFood(restaurantId, foodId);
      setFood(foodData);
      setRestoId(restaurantId);
    }
    getFood();
    const currentRes = async () => {
      let current = await restaurantService.show(restaurantId);
      setTempres(current);
    };
    currentRes();
  }, [foodId, restaurantId]);

  const handleAddComment = async (formData) => {
    const newComment = await commentService.createFC(
      restaurantId,
      foodId,
      formData
    );

    const copyFood = { ...food };
    copyFood.comments.push(newComment);
    setFood(copyFood);
  };

  //----------------------------------------------

  const handlesubmitDelete = async (e) => {
    e.preventDefault();
    handleDeleteComment(restaurantId, foodId, e.target.id);

    const newRes = food.comments.filter(
      (comment) => comment._id !== e.target.id
    );

    const updatefood = { ...food, comments: newRes };
    setFood(updatefood);

    //setRestaurant(newRes);
  };

  //----------------------------------------------

  const handleDeleteComment = async (rId, foodId, commentId) => {
    commentService.deleteFoodComment(rId, foodId, commentId);

    // await props.handleDeleteRestaurant(restaurantsId);
    // navigate(`/owners/${props.user.id}`);
  };

  const handleDeleteClick = () => {
    props.handleDeleteFood(restoId, food._id);
  };

  //----------------------------------------------

  if (!food || !tempres) {
    return <main className="loading">loading....</main>;
  }

  return (
    <div className="food-details">
      <div className="food-header">
        <h4 className="food-name">{food.name}</h4>
        <ul className="food-info">
          <li>dish type : {food.type}</li>
          <br />
          <li>dish description : {food.description}</li>
          <br />
          <li>price : ${food.price}</li>
        </ul>
        {props.user.id === tempres.owner && (
          <div className="food-actions">
            <Link
              to={`/restaurants/${restaurantId}/menu/${foodId}/edit`}
              className="edit-link"
            >
              Edit
            </Link>
            <button onClick={handleDeleteClick} className="delete-button">
              Delete Food
            </button>
          </div>
        )}
      </div>
      <div className="comments-section">
        {food.comments.length === 0 ? (
          <div className="no-comments">
            <h4>no comments yet</h4>
            <CommentForm handleAddComment={handleAddComment} />
          </div>
        ) : (
          <div className="comments-list">
            <CommentForm handleAddComment={handleAddComment} />
            <h4>comments:</h4>

            {food.comments.map((comment) => {
              return (
                <div key={comment._id} className="comment">
                  <form
                    className="comment-form"
                    action=""
                    id={comment._id}
                    onSubmit={handlesubmitDelete}
                  >
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default foodDetails;
