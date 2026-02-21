import React from "react";

function TruckIcon({ className = "logo-icon", size = 24 }) {
  return (
    <svg 
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M1 6V15H3C3 16.66 4.34 18 6 18C7.66 18 9 16.66 9 15H15C15 16.66 16.34 18 18 18C19.66 18 21 16.66 21 15H23V11L20 8H17V6H1Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <circle cx="6" cy="15" r="2" stroke="currentColor" strokeWidth="2"/>
      <circle cx="18" cy="15" r="2" stroke="currentColor" strokeWidth="2"/>
      <path 
        d="M17 8V6H1V15" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M17 8H20L23 11" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default TruckIcon;
