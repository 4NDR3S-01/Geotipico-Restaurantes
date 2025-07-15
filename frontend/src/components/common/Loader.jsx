import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/Loader.css';

const Loader = ({ size = 'medium', color = 'primary' }) => {
  return (
    <div className={`loader loader-${size} loader-${color}`}>
      <div className="loader-circle"></div>
    </div>
)};

Loader.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string
};

export default Loader;