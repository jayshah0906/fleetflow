// Regex patterns and validation utilities
const validators = {
  // License plate format: ABC-1234 or similar
  licensePlateRegex: /^[A-Z0-9]{2,4}-[A-Z0-9]{2,4}$/,
  
  // Email validation
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Driver license format
  driverLicenseRegex: /^[A-Z0-9]{6,15}$/,
  
  // Validate license plate
  isValidLicensePlate: (plate) => {
    return validators.licensePlateRegex.test(plate);
  },
  
  // Validate email
  isValidEmail: (email) => {
    return validators.emailRegex.test(email);
  },
  
  // Validate driver license
  isValidDriverLicense: (license) => {
    return validators.driverLicenseRegex.test(license);
  },
  
  // XSS sanitization - removes potentially dangerous HTML/script tags
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },
  
  // Sanitize object recursively
  sanitizeObject: (obj) => {
    if (typeof obj !== 'object' || obj === null) {
      return validators.sanitizeInput(obj);
    }
    
    const sanitized = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'string') {
          sanitized[key] = validators.sanitizeInput(obj[key]);
        } else if (typeof obj[key] === 'object') {
          sanitized[key] = validators.sanitizeObject(obj[key]);
        } else {
          sanitized[key] = obj[key];
        }
      }
    }
    return sanitized;
  },
};

module.exports = validators;
