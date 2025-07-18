import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/Loader.css'

const Loader = ({ size = 'medium', color = 'primary', text = null }) => {
  return (
    <div className={`loader-wrapper loader-wrapper-${size}`}>
      <div className={`loader loader-${size} loader-${color}`}>
        <div className="loader-circle"></div>
        <div className="loader-circle"></div>
        <div className="loader-circle"></div>
      </div>
      {text && <p className="loader-text">{text}</p>}
    </div>
)};

Loader.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['primary', 'secondary', 'accent']),
  text: PropTypes.string
};

export default React.memo(Loader);