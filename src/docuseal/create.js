
const {DOCUSEAL_API_URL, DOCUSEAL_API_KEY} = process.env;

/**
 * Creates a new submission in Docuseal using the specified template and data.
 * Sends a POST request to the Docuseal API to create a submission based on the provided template ID and data.
 *
 * @param {string} template_id - The ID of the template to use for the submission.
 * @param {Object} data - The data to include in the submission.
 * @param {string} data.fieldName - The name of the field in the template.
 * @param {string} data.fieldValue - The value to set for the field in the template.
 * @returns {Promise<Object>} - A promise that resolves to the response object from the Docuseal API.
 * @throws {Error} - Throws an error if there is an issue with the API request or response.
 */
exports.createDocusealSubmission = async (template_id, data) => {
    return fetch(`${DOCUSEAL_API_URL}/submissions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': DOCUSEAL_API_KEY,
        },
        body: JSON.stringify(data),
    }).then((res) => res.json());
};
