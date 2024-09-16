// <editor-fold defaultstate="collapsed" desc="imports">
const {onLoginBiometric, onSetupBiometric} = require('./biometric_impl');
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="onLoginBiometric">
/**
 * Handles biometric login by verifying the user's face against a stored face descriptor.
 *
 * @function
 * @param {Object} data - The data object containing user information and face match details.
 * @param {string} access_type - The type of access, which determines user permissions.
 * @param {string} data.username - The email of the user.
 * @param {Object} data.match - The face descriptor data used for matching.
 * @param {Object} data.displaySize - The size to which the detected face should be resized.
 * @returns {Promise<string|Object>} - A promise that resolves with a string indicating the result or an object containing a custom token if successful.
 */
exports.onLoginBiometric = onLoginBiometric;
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="onSetupBiometric">
/**
 * Sets up biometric authentication for a user by saving their face image and updating their profile.
 *
 * @function
 * @param {Object} data - The data object containing user information and image data.
 * @param {string} access_type - The type of access, which determines user permissions.
 * @param {string} data.uid - The unique identifier of the user.
 * @param {string} data.imgSrc - The base64 encoded image source of the user's face.
 * @returns {Promise<string|Object>} - A promise that resolves with a string indicating the result or an object containing a custom token if successful.
 */
exports.onSetupBiometric = onSetupBiometric;
// </editor-fold>