import ReactDom from 'react-dom';

import classes from './Modal.module.css';

const Backdrop = props => {
  return <div className={classes.backdrop} onClick={props.onClose}></div>;
};

const ModalOverlay = ({ children }) => {
  return (
    <div className={classes.modal}>
      <div className={classes.content}>{children}</div>
    </div>
  );
};

const portalElement = document.getElementById('overlays');

const Modal = ({ children, onClose }) => {
  
  const onCloseHandler = () => {
    onClose();
  };

  return (
    <>
      {ReactDom.createPortal(
        <Backdrop onClose={onCloseHandler} />,
        portalElement
      )}
      {ReactDom.createPortal(
        <ModalOverlay>{children}</ModalOverlay>,
        portalElement
      )}
    </>
  );
};

export default Modal;
