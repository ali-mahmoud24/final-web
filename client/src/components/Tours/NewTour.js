import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Button from '../../shared/components/FormElements/Button';

import Input from '../../shared/components/FormElements/Input';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';

import useForm from '../../shared/hooks/use-form';

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MIN,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
} from '../../shared/utils/validators';

import classes from './TourForm.module.css';

const NewTour = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [file, setFile] = useState(null);

  const [formState, inputHandler] = useForm(
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
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const submitHandler = async (event) => {
    event.preventDefault();

    console.log(formState.inputs);

    if (!formState.isValid) {
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();

      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('location', formState.inputs.location.value);
      formData.append('price', formState.inputs.price.value);
      formData.append('duration', formState.inputs.duration.value);
      formData.append('date', formState.inputs.date.value);
      formData.append('image', formState.inputs.image.value);

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/add-tour`,
        {
          method: 'POST',
          body: formData,
        }
      );
      console.log(response);

      if (response.ok) {
        setIsLoading(false);
        navigate('/tours', { replace: true });
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  return (
    <form onSubmit={submitHandler} className={classes.form}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorMessage="Title must not be empty."
        onInput={inputHandler}
      />

      <Input
        id="description"
        element="textarea"
        type="text"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(1), VALIDATOR_MAXLENGTH(250)]}
        errorMessage="Please enter a valid description (between 1 - 250 chars)."
        onInput={inputHandler}
      />

      <Input
        id="location"
        element="input"
        type="text"
        label="Location"
        validators={[VALIDATOR_REQUIRE()]}
        errorMessage="Location must not be empty."
        onInput={inputHandler}
      />

      <Input
        id="price"
        element="input"
        type="number"
        label="Price"
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MIN(0)]}
        errorMessage="Price must not be empty."
        onInput={inputHandler}
      />

      <Input
        id="duration"
        element="input"
        type="number"
        label="Duration"
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MIN(0)]}
        errorMessage="Duration must not be empty."
        onInput={inputHandler}
      />

      <Input
        id="date"
        element="input"
        type="date"
        label="Date"
        validators={[VALIDATOR_REQUIRE()]}
        errorMessage="Date must not be empty."
        onInput={inputHandler}
      />

      {/* <Input
        id="image"
        element="input"
        type="number"
        label="Image Url"
        validators={[VALIDATOR_REQUIRE()]}
        errorMessage="Image Url can't be empty."
        onInput={inputHandler}
      /> */}

      <ImageUpload
        id="image"
        onInput={inputHandler}
        errorText="Please provide an image."
      />

      <div className={classes.actions}>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <LoadingSpinner /> : 'Add Tour'}
        </Button>
      </div>
    </form>
  );
};

export default NewTour;
