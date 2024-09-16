// <editor-fold defaultstate="collapsed" desc="imports">
// const faceapi = require('face-api.js');
// </editor-fold>

const {loadFaceModels, loadImage, createFaceUrl, deleteTmpImage} = require('../../../libs/funs_impl');
const CustomUserClaims = require("../graphql/CustomUserClaims");
const updateUser = require("../queries/updateUser");

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
exports.onLoginBiometric = async (data, access_type) => {
    await authorize(access_type);

    if(!data) return null;

    const {username, match, displaySize} = data;

    if (username && match && displaySize) {
        const queryData = CustomUserClaims[access_type];
        if (!queryData) {
            return null;
        }

        const {query, operationName} = queryData;

        console.log('onLoginBiometric', username, match, displaySize)
        const _auth = adminAuth(access_type);
        return _auth.getUserByEmail(username).then(async (userRecord) => {
            if (!userRecord) {
                return "NO_USER_AUTH";
            }

            const {uid, email, phoneNumber} = userRecord;

            const item = await getRelayOne({
                query,
                operationName,
                variables: {auth_id: uid},
            });
            if (!item) {
                return "NO_USER_DB";
            }

            const {auth_type = "MultiFactor", has_biometric} = item.data;
            if (auth_type === "Biometric") {
                if (!has_biometric) {
                    return "SETUP_BIOMETRIC";
                }
            } else {
                return "NO_BIOMETRIC_PERMISSION";
            }

            try {
                await loadFaceModels();
            } catch (err) {
                console.error(err)
                return "ERR_LOAD_MODELS";
            }

            const storageBucket = admin.storage().bucket('sheqsolve-biometrics');
            const facePath = createFaceUrl(uid);
            let bucketFile = await storageBucket.file(facePath);

            const userImage = await loadImage(bucketFile, uid);

            console.log('onLoginBiometric userImage', userImage, userImage.width, userImage.height)
            const detection = await faceapi.detectSingleFace(userImage).withFaceLandmarks().withFaceDescriptor();
            console.log('onLoginBiometric detection', !!detection, displaySize)
            if (detection) {
                const resizedDetection = faceapi.resizeResults(detection, displaySize);
                const faceMatcher = faceapi.FaceMatcher.fromJSON(match);
                const bestMatch = faceMatcher.findBestMatch(resizedDetection.descriptor);
                const {label, distance} = bestMatch;
                console.log('onLoginBiometric label, distance', label, distance)

                deleteTmpImage(uid);

                if (label === "unknown") {
                    return "UNKNOWN_DETECTION";
                } else {
                    try {
                        const customToken = await _auth.createCustomToken(uid, {access_type});
                        return {customToken};
                    } catch (err) {
                        console.error(err)
                        return "ERR_CREATING_TOKEN";
                    }
                }
            } else {
                deleteTmpImage(uid);
            }

            return "NO_DETECTION";
        });
    } else {
        return null;
    }
};
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
exports.onSetupBiometric = async (data, access_type) => {
    await authorize(access_type);

    if(!data) return null;

    const {uid, imgSrc} = data;

    if (uid && imgSrc) {
        const queryData = CustomUserClaims[access_type];
        if (!queryData) {
            return null;
        }

        const {query, operationName} = queryData;

        const _auth = adminAuth(access_type);
        return _auth.getUser(uid).then(async (userRecord) => {
            if (!userRecord) {
                return "NO_USER_AUTH";
            }

            const {uid, email, phoneNumber} = userRecord;

            const item = await getRelayOne({
                query,
                operationName,
                variables: {auth_id: uid},
            });
            if (!item) {
                return "NO_USER_DB";
            }

            const {id} = item;

            const storageBucket = admin.storage().bucket('sheqsolve-biometrics');
            const facePath = createFaceUrl(uid);
            let bucketFile = await storageBucket.file(facePath);
            try {
                const base64 = imgSrc.split(',')[1];
                const buffer = Buffer.from(base64, 'base64');//data_url
                await bucketFile.save(buffer, {
                    metadata: {
                        contentType: 'image/png',
                        metadata: {
                            faceAccessType: access_type,
                            faceUserId: uid
                        },
                        public: false,
                        validation: 'md5'
                    }
                });
            } catch (err) {
                console.error(err)
                return "ERR_UPLOAD";
            }

            try {
                const res = await updateUser({id, attrs: {has_biometric: true}, access_type});
                if(!res) {
                    return null;
                }
                if(res === "NO_DB_USER") {
                    return res;
                }
            } catch (err) {
                return "ERR_UPDATE_USER";
            }
            try {
                const customToken = await _auth.createCustomToken(uid, {access_type});
                return {customToken};
            } catch (err) {
                console.error(err)
                return "ERR_CREATING_TOKEN";
            }
        });
    } else {
        return null;
    }
};
// </editor-fold>
