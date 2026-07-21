import React from 'react';
import { motion } from 'framer-motion';

const WaveAnimation = ({ width = 200, height = 100, color = '#002FA7', className = '' }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 200 100" className={className}>
      <motion.path
        d="M0,50 Q25,20 50,50 T100,50 T150,50 T200,50"
        stroke={color}
        strokeWidth="3"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M0,50 Q25,80 50,50 T100,50 T150,50 T200,50"
        stroke={color}
        strokeWidth="3"
        fill="none"
        opacity="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
    </svg>
  );
};

export default WaveAnimation;