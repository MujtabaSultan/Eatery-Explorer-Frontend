import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, BrowserRouter } from "react-router-dom";
import authService from "./services/authService";
import restaurantService from "./services/restaurantService";
import FoodDetails from "./components/foodDetails/foodDetails";

// Components
import NavBar from "./components/NavBar/NavBar";
import Landing from "./components/Landing/Landing";
import Dashboard from "./components/Dashboard/Dashboard";
import SignupForm from "./components/SignupForm/SignupForm";
import SigninForm from "./components/SigninForm/SigninForm";
import RestaurantsList from "./components/RestaurantsList/RestaurantsList";
import RestaurantDetails from "./components/RestaurantDetails/RestaurantDetails";
import RestaurantForm from "./components/RestaurantForm/RestaurantForm";
import UpdateForm from "./components/RestaurantForm/UpdateForm";
import OwnerDetails from "./components/OwnerDetails/OwnerDetails";
import AddFoodForm from "./components/AddFoodForm/AddFoodForm";
import EditFoodForm from "./components/EditFoodForm/EditFoodForm";

const App = () => {
  const [user, setUser] = useState(authService.getUser());
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();
  const [resId, setRestId] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  async function getRestaurants() {
    const restaurantData = await restaurantService.index();
    setRestaurants(restaurantData);
  }

  const mario = 10;
  useEffect(() => {
    async function getRestaurants() {
      const restaurantData = await restaurantService.index();
      setRestaurants(restaurantData);
      setUser(authService.getUser());
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
    const newRestaurant = await restaurantService.create(formData);
    setRestaurants([...restaurants, newRestaurant]);
    navigate(`restaurants/owner/${user.id}`);
  };

  const handleUpdateRestaurant = async (restaurantId, formData) => {
    try {
      const updatedRestaurant = await restaurantService.update(
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
      const deletedRestaurant = await restaurantService.deleter(restaurantId);
      getRestaurants();
      navigate(`restaurants/owner/${user.id}`);
    } catch (error) {
      console.error("Error deleting food:", error);
    }
  };

  const handleAddFood = async (restaurantId, formData) => {
    try {
      const updatedRestaurant = await restaurantService.addFood(
        restaurantId,
        formData
      );
      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((restaurant) =>
          restaurant._id === restaurantId
            ? { ...restaurant, menu: [...restaurant.menu, formData] }
            : restaurant
        )
      );

      navigate(`/restaurants/${restaurantId}`);
    } catch (error) {
      console.error("Error adding food:", error);
    }
  };
  const handleUpdateFood = async (restaurantId, foodId, updatedFoodData) => {
    try {
      const updatedFood = await restaurantService.updateFood(
        restaurantId,
        foodId,
        updatedFoodData
      );

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

      navigate(`/restaurants/${restaurantId}/menu/${foodId}`);
    } catch (error) {
      console.error("Error updating food:", error);
    }
  };

  const handleDeleteFood = async (restaurantId, foodId) => {
    try {
      await restaurantService.deleteFood(restaurantId, foodId);
      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((restaurant) =>
          restaurant._id === restaurantId
            ? {
                ...restaurant,
                menu: restaurant.menu.filter((food) => food._id !== foodId),
              }
            : restaurant
        )
      );
      navigate(`/restaurants/${restaurantId}`);
    } catch (error) {
      console.error("Error deleting food:", error);
    }
  };

  return (
    <>
        <NavBar user={user} handleSignout={handleSignout} setUser={setUser} />
        <Routes>
          {user ? (
            <>
              <Route path="/owners/:ownerId" element={<OwnerDetails />} />

              <Route path="/" element={<Dashboard user={user} />} />
              <Route
                path="/restaurants"
                element={<RestaurantsList restaurants={restaurants} />}
              />
              <Route
                path="/restaurants/:restaurantsId"
                element={
                  <RestaurantDetails
                    setRestId={setRestId}
                    user={user}
                    setSelectedRestaurant={setSelectedRestaurant}
                    handleDeleteRestaurant={handleDeleteRestaurant}
                  />
                }
              />

              <Route
                path={`/restaurants/:restaurantId/menu/:foodId`}
                element={
                  <FoodDetails
                    restaurants={restaurants}
                    resId={resId}
                    user={user}
                    selectedRestaurant={selectedRestaurant}
                    handleDeleteFood={handleDeleteFood}
                  />
                }
              />
              <Route
                path="/restaurants/new"
                element={
                  <RestaurantForm handleAddRestaurant={handleAddRestaurant} />
                }
              />
              <Route
                path="restaurants/owner/:ownerId"
                element={<OwnerDetails />}
              />
              <Route
                path="/restaurants/:restaurantId/edit"
                element={
                  <UpdateForm handleUpdateRestaurant={handleUpdateRestaurant} />
                }
              />
              <Route
                path="/restaurants/:restaurantId/add-food"
                element={<AddFoodForm handleAddFood={handleAddFood} />}
              />
              <Route
                path="/restaurants/:restaurantId/menu/:foodId/edit"
                element={
                  <EditFoodForm
                    handleUpdateFood={handleUpdateFood}
                    selectedRestaurant={selectedRestaurant}
                  />
                }
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
