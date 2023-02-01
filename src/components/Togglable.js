import PropTypes from 'prop-types';
import { useState, forwardRef, useImperativeHandle } from 'react';

const Togglable = forwardRef(
  ({ children, buttonLabel, cancelLabel = 'cancel' }, ref) => {
    const [visible, setVisible] = useState(false);

    const showWhenVisible = { display: visible ? 'block' : 'none' };
    const hideWhenVisible = { display: visible ? 'none' : 'block' };
    const toggleVisibility = () => setVisible((v) => !v);

    useImperativeHandle(ref, () => ({ toggleVisibility }));

    return (
      <>
        <div style={showWhenVisible}>
          {children}
          <button onClick={toggleVisibility}>{cancelLabel}</button>
        </div>

        <div style={hideWhenVisible}>
          <button onClick={toggleVisibility}>{buttonLabel}</button>
        </div>
      </>
    );
  }
);

Togglable.displayName = 'Togglable';

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

export default Togglable;
