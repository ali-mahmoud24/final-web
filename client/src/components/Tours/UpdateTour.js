import { useState, useEffect, useContext } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';

import AuthContext from '../../shared/context/auth-context';

import useForm from '../../shared/hooks/use-form';

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MIN,
  VALIDATOR_MAX,
} from '../../shared/utils/validators';

import classes from './TourForm.module.css';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';

const UpdateTour = () => {
  const [loadedTour, setLoadedTour] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const { token } = useContext(AuthContext);

  const navigate = useNavigate();
  const params = useParams();

  const { tourId } = params;

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
      location: {
        value: '',
        isValid: false,
      },
      price: {
        value: '',
        isValid: false,
      },
      duration: {
        value: '',
        isValid: false,
      },
      date: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/admin/tours/${tourId}`
        );
        const responseData = await response.json();
        setIsLoading(false);

        setLoadedTour(responseData.tour);

        setFormData(
          {
            title: {
              value: responseData.tour.title,
              isValid: true,
            },
            description: {
              value: responseData.tour.description,
              isValid: true,
            },
            location: {
              value: responseData.tour.location,
              isValid: true,
            },
            price: {
              value: responseData.tour.price,
              isValid: true,
            },
            duration: {
              value: responseData.tour.duration,
              isValid: true,
            },
            date: {
              value: responseData.tour.date,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };
    fetchTour();
  }, [setFormData, tourId, token]);

  const tourUpdateSubmitHandler = async (event) => {
    event.preventDefault();

    console.log(formState.inputs)

    try {
      await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/tours/${tourId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            title: formState.inputs.title.value,
            description: formState.inputs.description.value,
            location: formState.inputs.location.value,
            price: formState.inputs.price.value,
            duration: formState.inputs.duration.value,
            date: formState.inputs.date.value,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      navigate('/tours', { replace: true });
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  if (loadedTour == null) return null;

  return (
    <form onSubmit={tourUpdateSubmitHandler} className={classes.form}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorMessage="Title must not be empty."
        onInput={inputHandler}
        initialValue={loadedTour.title}
      />

      <Input
        id="description"
        element="textarea"
        type="text"
        label="Description"
        validators={[VALIDATOR_MIN(1), VALIDATOR_MAX(50)]}
        errorMessage="Please enter a valid description (between 1 - 50 chars)."
        onInput={inputHandler}
        initialValue={loadedTour.description}
      />

      <Input
        id="location"
        element="input"
        type="text"
        label="Location"
        validators={[VALIDATOR_REQUIRE()]}
        errorMessage="Location must not be empty."
        onInput={inputHandler}
        initialValue={loadedTour.location}
      />

      <Input
        id="price"
        element="input"
        type="number"
        label="Price"
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MIN(0)]}
        errorMessage="Price must not be empty."
        onInput={inputHandler}
        initialValue={loadedTour.price}
      />

      <Input
        id="duration"
        element="input"
        type="number"
        label="Duration"
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MIN(0)]}
        errorMessage="Duration must not be empty."
        onInput={inputHandler}
        initialValue={loadedTour.duration}
      />

      <Input
        id="date"
        element="input"
        type="date"
        label="Date"
        validators={[VALIDATOR_REQUIRE()]}
        errorMessage="Date must not be empty."
        onInput={inputHandler}
        initialValue={loadedTour.date}
      />

      <div className={classes.actions}>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <LoadingSpinner /> : 'Update Tour'}
        </Button>
      </div>
    </form>
  );
};

export default UpdateTour;
