import React from 'react';
import { motion } from 'framer-motion';

const GearAnimation = ({ size = 100, color = '#002FA7', className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
    >
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '50% 50%' }}
      >
        <path
          d="M50,10 L55,20 L65,18 L60,28 L70,32 L62,40 L70,48 L60,52 L65,62 L55,60 L50,70 L45,60 L35,62 L40,52 L30,48 L38,40 L30,32 L40,28 L35,18 L45,20 Z"
          fill={color}
          stroke="#0A0A0A"
          strokeWidth="2"
        />
        <circle cx="50" cy="50" r="12" fill="#FFFFFF" stroke="#0A0A0A" strokeWidth="2" />
        <circle cx="50" cy="50" r="6" fill={color} stroke="#0A0A0A" strokeWidth="1" />
      </motion.g>
    </svg>
  );
};

export default GearAnimation;