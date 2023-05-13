import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '../../shared/components/UI/Card';
import Button from '../../shared/components/FormElements/Button';

import AuthContext from '../../shared/context/auth-context';

import classes from './TourItem.module.css';

const TourItem = (props) => {
  const { id, title, description, duration, price, date, location, imageUrl } =
    props;

  const navigate = useNavigate();

  const deleteTourHandler = async () => {
    try {
      await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/tours/${props.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json',
          },
        }
      );
      props.onDelete(props.id);
    } catch (err) {
      console.log(err);
    }
  };

  const redirectToEdit = () => {
    navigate(`/tours/${props.id}`);
  };

  return (
    <>
      <li className={classes['tour-card']}>
        <div className={classes['tour-img-container']}>
          <img
            src={`${process.env.REACT_APP_BACKEND_URL}/${imageUrl}`}
            alt={title}
            className={classes['tour-img']}
          />
          <p className={classes['tour-date']}>{date}</p>
        </div>

        <div className={classes['tour-info']}>
          <div className={classes['tour-title']}>
            <h4>{title}</h4>
            <p>{duration} days</p>
          </div>

          <p>{description}</p>
          <footer className={classes['tour-footer']}>
            <p>
              <span>
                <i className="fas fa-map"></i> {location}
              </span>
            </p>
            <p>from ${price}</p>
          </footer>
        </div>

        <div className={classes.actions}>
          <Button inverse onClick={redirectToEdit}>
            edit
          </Button>
          <Button danger onClick={deleteTourHandler}>
            delete
          </Button>
        </div>
      </li>
    </>
  );
};

export default TourItem;
