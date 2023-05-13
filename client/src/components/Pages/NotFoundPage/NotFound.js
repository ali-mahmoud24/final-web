import Button from '../../../shared/components/FormElements/Button';
import classes from './NotFound.module.css';

const NotFound = () => {
  return (
    <section className={` ${classes['not-found']}`}>
      <h1>404 Error page not found!</h1>

      <Button to="/welcome" inverse size="big">
        Home page!
      </Button>
    </section>
  );
};

export default NotFound;
