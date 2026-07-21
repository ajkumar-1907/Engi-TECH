import React from 'react';
import { motion } from 'framer-motion';

const CircuitAnimation = ({ size = 100, color = '#002FA7', className = '' }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      <defs>
        <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor={color} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      
      {/* Circuit paths */}
      <path d="M10,20 L40,20" stroke="#0A0A0A" strokeWidth="2" fill="none" />
      <path d="M60,20 L90,20" stroke="#0A0A0A" strokeWidth="2" fill="none" />
      <path d="M10,50 L30,50" stroke="#0A0A0A" strokeWidth="2" fill="none" />
      <path d="M70,50 L90,50" stroke="#0A0A0A" strokeWidth="2" fill="none" />
      <path d="M10,80 L40,80" stroke="#0A0A0A" strokeWidth="2" fill="none" />
      <path d="M60,80 L90,80" stroke="#0A0A0A" strokeWidth="2" fill="none" />
      
      {/* Animated pulse */}
      <motion.circle
        cx="0"
        cy="20"
        r="3"
        fill={color}
        animate={{ cx: [10, 90] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
      <motion.circle
        cx="0"
        cy="50"
        r="3"
        fill={color}
        animate={{ cx: [10, 90] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', delay: 0.3 }}
      />
      <motion.circle
        cx="0"
        cy="80"
        r="3"
        fill={color}
        animate={{ cx: [10, 90] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 0.6 }}
      />
      
      {/* Resistor symbols */}
      <rect x="40" y="15" width="20" height="10" fill="none" stroke="#0A0A0A" strokeWidth="2" />
      <rect x="40" y="75" width="20" height="10" fill="none" stroke="#0A0A0A" strokeWidth="2" />
      
      {/* Capacitor */}
      <line x1="30" y1="45" x2="30" y2="55" stroke="#0A0A0A" strokeWidth="2" />
      <line x1="35" y1="45" x2="35" y2="55" stroke="#0A0A0A" strokeWidth="2" />
    </svg>
  );
};

export default CircuitAnimation;