import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import restaurantService from "../../services/restaurantService";
import './OwnerDetails.css';

const OwnerDetails = () => {
  const { ownerId } = useParams();
  const [restaurants, setRestaurants] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurantsAndOwner = async () => {
      try {
        const restaurantsData = await restaurantService.index();
        setRestaurants(
          restaurantsData.filter((restaurant) => restaurant.owner === ownerId)
        );

        const ownerData = await restaurantService.getOwnerById(ownerId);
        setOwner(ownerData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantsAndOwner();
  }, [ownerId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <main className="owner-details">
      <header className="owner-header">
        <h1>Restaurants Owned by {owner ? owner.username : "Loading..."}</h1>
        {restaurants.length === 0 ? (
          <p className="no-restaurants">No restaurants found.</p>
        ) : (
          <ul className="restaurant-list">
            {restaurants.map((restaurant) => (
              <li key={restaurant._id} className="restaurant-item">
                <Link to={`/restaurants/${restaurant._id}`} className="restaurant-link">
                  <div className="restaurant-card">
                    <p className="restaurant-name">{restaurant.name}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </header>
    </main>
  );
};

export default OwnerDetails;
