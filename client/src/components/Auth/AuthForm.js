import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';

import useForm from '../../shared/hooks/use-form';

import AuthContext from '../../shared/context/auth-context';

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from '../../shared/utils/validators';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const auth = useContext(AuthContext);

  const navigate = useNavigate();

  const [formState, inputHandler] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const switchAuthModeHandler = () => {
    setIsLoginMode((prevState) => !prevState);
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    if (!formState.isValid) {
      return;
    }

    if (isLoginMode) {
      // POST LOGIN DATA
      try {
        const loginResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/login`,
          {
            method: 'POST',
            body: JSON.stringify({
              email: formState.inputs.email.value,
              password: formState.inputs.password.value,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const loginData = await loginResponse.json();

        auth.login(loginData.userId, loginData.token, null);

        navigate('/tours', { replace: true });
      } catch (error) {
        alert(error);
      }
    } else {
      // POST SIGNUP DATA
      try {
        const signupResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/signup`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formState.inputs.email.value,
              password: formState.inputs.password.value,
            }),
          }
        );

        const signupData = await signupResponse.json();

        auth.login(signupData.userId, signupData.token, null);

        navigate('/tours', { replace: true });
      } catch (error) {
        alert(error);
      }
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes['img-container']}></div>

      <div className={classes.authentication}>
        <h2>{isLoginMode ? 'Login Required' : 'Sign Up'}</h2>
        <form onSubmit={formSubmitHandler}>
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorMessage="Please enter a valid email."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorMessage="Please enter a valid password, at least 6 characters."
            onInput={inputHandler}
          />

          <Button type="submit" block disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>

        {isLoginMode ? (
          <p className={classes.toggle}>
            Not a member? <a onClick={switchAuthModeHandler}>Sign up</a>
          </p>
        ) : (
          <p className={classes.toggle}>
            Already a member? <a onClick={switchAuthModeHandler}>Log in</a>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
