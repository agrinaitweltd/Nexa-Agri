
import React from 'react';

export const NexaLogo = ({ className = "h-8", light = false }) => {
  const strokeColor = light ? "white" : "currentColor";
  
  return (
    <div className={`flex items-center ${className}`}>
      <svg viewBox="0 0 160 60" className="h-full w-auto" xmlns="http://www.w3.org/2000/svg">
        {/* n - refined to be more lowercase/modern */}
        <path 
          d="M15 45V24C15 20 18 18 22 18C26 18 29 20 29 24V45" 
          fill="none" 
          stroke={strokeColor} 
          strokeWidth="5" 
          strokeLinecap="round" 
        />
        
        {/* e - refined eye and curve */}
        <path 
          d="M38 32H58C58 24 53 18 48 18C41 18 35 24 35 32C35 40 41 46 48 46C54 46 58 42 58 42" 
          fill="none" 
          stroke={strokeColor} 
          strokeWidth="5" 
          strokeLinecap="round" 
        />
        
        {/* x stylized overlapping arcs - centered between e and a */}
        {/* Top arc (Blue) */}
        <path 
          d="M70 20C80 20 95 44 105 44" 
          fill="none" 
          stroke="#00c2ff" 
          strokeWidth="6" 
          strokeLinecap="round" 
        />
        {/* Bottom arc (Green) */}
        <path 
          d="M70 44C80 44 95 20 105 20" 
          fill="none" 
          stroke="#00df82" 
          strokeWidth="6" 
          strokeLinecap="round" 
        />
        
        {/* a - refined bowl and stem */}
        <path 
          d="M142 32C142 24 136 18 128 18C120 18 114 24 114 32C114 40 120 46 128 46C136 46 142 40 142 32V45" 
          fill="none" 
          stroke={strokeColor} 
          strokeWidth="5" 
          strokeLinecap="round" 
        />
      </svg>
    </div>
  );
};
