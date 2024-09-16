
const {DOCUSEAL_API_URL, DOCUSEAL_API_KEY} = process.env;

/**
 * Retrieves a Docuseal template by its ID.
 * Sends a GET request to the Docuseal API to fetch the template with the specified ID.
 *
 * @param {string} id - The ID of the template to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the template object from the Docuseal API.
 * @throws {Error} - Throws an error if there is an issue with the API request or response.
 */
exports.findByIdDocusealTemplate = async (id) => {
    return fetch(`${DOCUSEAL_API_URL}/templates/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': DOCUSEAL_API_KEY,
        }
    }).then((res) => res.json());
};

/**
 * Retrieves a Docuseal submitter by their ID.
 * Sends a GET request to the Docuseal API to fetch the submitter with the specified ID.
 *
 * @param {string} id - The ID of the submitter to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the submitter object from the Docuseal API.
 * @throws {Error} - Throws an error if there is an issue with the API request or response.
 */
exports.findByIdDocusealSubmitter = async (id) => {
    return fetch(`${DOCUSEAL_API_URL}/submitters/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': DOCUSEAL_API_KEY,
        }
    }).then((res) => res.json());
};

/**
 * Retrieves a Docuseal submission by its ID.
 * Sends a GET request to the Docuseal API to fetch the submission with the specified ID.
 *
 * @param {string} id - The ID of the submission to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the submission object from the Docuseal API.
 * @throws {Error} - Throws an error if there is an issue with the API request or response.
 */
exports.findByIdDocusealSubmission = async (id) => {
    return fetch(`${DOCUSEAL_API_URL}/submissions/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': DOCUSEAL_API_KEY,
        }
    }).then((res) => res.json());
};