import { useState, useEffect, useContext } from 'react';

import TourItem from './TourItem';
import AuthContext from '../../shared/context/auth-context';

import classes from './TourList.module.css';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';

const ToursList = () => {
  const [loadedTours, setLoadedTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { token } = useContext(AuthContext);

  const tourDeletedHandler = (deletedTourId) => {
    setLoadedTours((prevTours) =>
      prevTours.filter((tour) => tour.id !== deletedTourId)
    );
  };

  useEffect(() => {
    const fetchTours = async () => {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/tours`
      );
      const data = await response.json();
      setLoadedTours(data.tours);
      setIsLoading(false);
    };
    fetchTours();
  }, [token]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!loadedTours || loadedTours.length === 0) {
    return (
      <div className="center">
        <h1>No Tours found!</h1>
      </div>
    );
  }

  const toursList = loadedTours.map((tour) => (
    <TourItem
      key={tour._id}
      id={tour._id}
      title={tour.title}
      description={tour.description}
      duration={tour.duration}
      price={tour.price}
      date={tour.date}
      location={tour.location}
      imageUrl={tour.image}
      onDelete={tourDeletedHandler}
    />
  ));

  return (
    <>
      <ul className={classes['featured-center']}>{toursList}</ul>
    </>
  );
};

export default ToursList;
