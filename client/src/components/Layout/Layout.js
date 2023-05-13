import Header from './Header';

import classes from './Layout.module.css'

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main className={classes.main}>{children}</main>
    </>
  );
};

export default Layout;
