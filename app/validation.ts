// Importing the necessary function from Remix for returning JSON responses (commented out here)
// import { json } from "@remix-run/react";

// Function to validate an email address format
export function validateEmail(email: string) {
  // Regular expression pattern to match a valid email format
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // If the email is not a string or does not match the pattern, return an error message
  if (typeof email !== "string" || !pattern.test(email)) {
    return "Email is invalid"; // Return a message indicating the email is invalid
  }
}

// Function to validate a password based on certain criteria
export function validatePassword(password: string) {
  // Regular expressions to check for uppercase letters, lowercase letters, numbers, and special characters
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const numberRegex = /[0-9]/;
  const specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\-]/;

  // Check if the password length is less than 8 characters
  if (password.length < 8) {
    return "Password must be at least 8 characters long"; // Return a message if the password is too short
  } else if (
    // Check if the password is missing any of the required components: uppercase, lowercase, number, or special character
    !uppercaseRegex.test(password) ||
    !lowercaseRegex.test(password) ||
    !numberRegex.test(password) ||
    !specialCharRegex.test(password)
  ) {
    return "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"; // Return a message if any criteria is not met
  }
}

// The following function is commented out but checks the validity of a text message
// export function validateText(message) {
//   // If the message is not a string or is too short (less than 2 characters), return an error message
//   if (typeof message !== "string" || message.length < 2) {
//     return "Input is invalid"; // Return an error message for invalid input
//   }
// }

// The following function is commented out but would return a JSON response with a 404 status
// export function badRequest(data) {
//   return json(data, { status: 404 }); // Return a JSON response with status 404 (Not Found)
// }
