import React from "react";

function Logo({ size = 120, className = "logo" }) {
  return (
    <img 
      src="/img1.png" 
      alt="NexTrack Logo" 
      className={className}
      style={{ 
        height: `${size}px`,
        width: 'auto',
        objectFit: 'contain'
      }}
    />
  );
}

export default Logo;
