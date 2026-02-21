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
};

module.exports = validators;
