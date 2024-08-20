import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import authService from "./services/authService";
import hootService from "./services/hootService";
import FoodDetails from "./components/foodDetails/foodDetails";


// Components
import NavBar from "./components/NavBar/NavBar";
import Landing from "./components/Landing/Landing";
import Dashboard from "./components/Dashboard/Dashboard";
import SignupForm from "./components/SignupForm/SignupForm";
import SigninForm from "./components/SigninForm/SigninForm";
import HootList from "./components/HootList/HootList";
import HootDetails from "./components/HootDetails/HootDetails";
import HootForm from "./components/HootForm/HootForm";
import UpdateForm from "./components/HootForm/UpdateForm";
import OwnerDetails from "./components/OwnerDetails/OwnerDetails";
import AddFoodForm from "./components/AddFoodForm/AddFoodForm";
import EditFoodForm from "./components/EditFoodForm/EditFoodForm";

const App = () => {
  const [user, setUser] = useState(authService.getUser());
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();
  const [resId, setRestId] = useState(null);
 // console.log("thia ia app user",user)

  //-------------------------------------

  async function getRestaurants() {
    const restaurantData = await hootService.index();
    setRestaurants(restaurantData);
  }

  //---------------------------------

  const mario = 10;
  useEffect(() => {
    async function getRestaurants() {
      const restaurantData = await hootService.index();
      setRestaurants(restaurantData);
    }
    if (user) {
      getRestaurants();
    }
  }, [user]);

  const handleSignout = () => {
    authService.signout();
    setUser(null);
  };

  const handleAddRestaurant = async (formData) => {
    const newRestaurant = await hootService.create(formData);
    setRestaurants([...restaurants, newRestaurant]);
    navigate("/restaurants");
  };

  const handleUpdateRestaurant = async (restaurantId, formData) => {
    try {
      const updatedRestaurant = await hootService.update(
        restaurantId,
        formData
      );
      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((restaurant) =>
          restaurant._id === restaurantId ? updatedRestaurant : restaurant
        )
      );
      navigate(`/restaurants/${restaurantId}`);
    } catch (error) {
      console.error("Error updating restaurant:", error);
    }
  };


  const handleDeleteRestaurant = async (restaurantId) => {
    try {
      const deletedRestaurant = await hootService.deleter(restaurantId);
      getRestaurants();
      navigate(`restaurants/owner/${user.id}`);
    
  }  catch (error) {
    console.error("Error deleting food:", error);
  }};

  const handleAddFood = async (restaurantId, formData) => {
    try {
      const updatedRestaurant = await hootService.addFood(restaurantId, formData);
      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((restaurant) =>
          restaurant._id === restaurantId ? updatedRestaurant : restaurant
        )
      );
      navigate(`/restaurants/${restaurantId}`);

    } catch (error) {
      console.error("Error adding food:", error);
    }
  };
  const handleUpdateFood = async (restaurantId, foodId, updatedFoodData) => {
    try {
      const updatedFood = await hootService.updateFood(restaurantId, foodId, updatedFoodData);
      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((restaurant) =>
          restaurant._id === restaurantId
            ? {
                ...restaurant,
                menu: restaurant.menu.map((food) =>
                  food._id === foodId ? updatedFood : food
                ),
              }
            : restaurant
        )
      );
      navigate(`/restaurants/${restaurantId}/menu`);
    } catch (error) {
      console.error("Error updating food:", error);
    }
  };

  return (
    <>
      <NavBar user={user} handleSignout={handleSignout} />
      <Routes>
        {user ? (
          // Protected Routes:
          <>
            <Route path="/owners/:ownerId" element={<OwnerDetails />} />

            <Route path="/" element={<Dashboard user={user} />} />
            <Route
              path="/restaurants"
              element={<HootList restaurants={restaurants} />}
            />
            <Route
              path="/restaurants/:restaurantsId"
              element={
                <HootDetails
                  setRestId={setRestId}
                  user={user}
                  handleDeleteRestaurant={handleDeleteRestaurant}
                />
              }
            />

            <Route
              path={`/restaurants/:restaurantId/menu/:foodId`}
              element={<FoodDetails restaurants={restaurants} resId={resId} user={user} />}
            />
            <Route
              path="/restaurants/new"
              element={<HootForm handleAddRestaurant={handleAddRestaurant} />}
            />
            <Route path="restaurants/owner/:ownerId" element={<OwnerDetails />} />
           <Route path="/restaurants/:restaurantId/edit" element={<UpdateForm handleUpdateRestaurant={handleUpdateRestaurant} />} />
           <Route
            path="/restaurants/:restaurantId/add-food"
             element={<AddFoodForm handleAddFood={handleAddFood} />}
/>         
   <Route
        path="/restaurants/:restaurantId/menu/:foodId/edit"
        element={<EditFoodForm handleUpdateFood={handleUpdateFood} />}
      />
              
          </>
        ) : (
          // Public Route:
          <Route path="/" element={<Landing />} />
        )}
        <Route path="/signup" element={<SignupForm setUser={setUser} />} />
        <Route path="/signin" element={<SigninForm setUser={setUser} />} />
      </Routes>
    </>
  );
};

export default App;
