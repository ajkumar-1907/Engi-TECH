import React from 'react';
import { motion } from 'framer-motion';

const BlueprintAnimation = ({ size = 100, color = '#002FA7', className = '' }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {/* Grid background */}
      <defs>
        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#E5E5E5" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#grid)" />
      
      {/* Building outline with drawing animation */}
      <motion.path
        d="M20,80 L20,30 L50,10 L80,30 L80,80 Z"
        stroke={color}
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
      />
      
      {/* Windows */}
      <motion.rect
        x="30" y="40" width="8" height="8"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
      />
      <motion.rect
        x="46" y="40" width="8" height="8"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
      />
      <motion.rect
        x="62" y="40" width="8" height="8"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
      />
    </svg>
  );
};

export default BlueprintAnimation;