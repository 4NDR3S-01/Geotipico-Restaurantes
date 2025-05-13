import React from 'react';
import '../../styles/Loader.css';

const Loader = ({ size = 'medium', color = 'primary' }) => {
  return (
    <div className={`loader loader-${size} loader-${color}`}>
      <div className="loader-circle"></div>
    </div>
  );
};

export default Loader;