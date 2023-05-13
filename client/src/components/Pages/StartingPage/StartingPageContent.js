import Button from '../../../shared/components/FormElements/Button';

import classes from './StartingPageContent.module.css';

const StartingPageContent = () => {
  return (
    <>
      <section className={classes.hero}>
        <div className={classes['hero-banner']}>
          <h1>CONTINUE EXPLORING</h1>
          <p>
            Live your dreams and start your new adventure with BackRoads Start
            Booking now.
          </p>
          <Button to="/tours">explore tours</Button>
        </div>
      </section>
    </>
  );
};

export default StartingPageContent;
