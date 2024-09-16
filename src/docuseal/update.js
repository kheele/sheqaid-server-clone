
const {DOCUSEAL_API_URL, DOCUSEAL_API_KEY} = process.env;

/**
 * Updates a Docuseal template with the specified ID.
 * Sends a PUT request to the Docuseal API to update the template with the given data.
 *
 * @param {string} id - The ID of the template to update.
 * @param {Object} data - The data to update the template with.
 * @returns {Promise<Object>} - A promise that resolves to the updated template object from the Docuseal API.
 * @throws {Error} - Throws an error if there is an issue with the API request or response.
 */
exports.updateDocusealTemplate = async (id, data) => {
    return fetch(`${DOCUSEAL_API_URL}/templates/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': DOCUSEAL_API_KEY,
        },
        body: JSON.stringify(data),
    }).then((res) => res.json());
};

/**
 * Updates a Docuseal submitter with the specified ID.
 * Sends a PUT request to the Docuseal API to update the submitter with the given data.
 *
 * @param {string} id - The ID of the submitter to update.
 * @param {Object} data - The data to update the submitter with.
 * @returns {Promise<Object>} - A promise that resolves to the updated submitter object from the Docuseal API.
 * @throws {Error} - Throws an error if there is an issue with the API request or response.
 */
exports.updateDocusealSubmitter = async (id, data) => {
    return fetch(`${DOCUSEAL_API_URL}/submitters/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': DOCUSEAL_API_KEY,
        },
        body: JSON.stringify(data),
    }).then((res) => res.json());
};
