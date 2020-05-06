const response = require("./response").default;

/**
 * Send back appropiate errors to the client.
 * @param {Object[]} errors - An array of errors returned from Fauna GraphQL
 * @param {String} subject - The subject of the error. e.g User, Tender
 * @param {Response} res - A response object
 */
function gqlErrors (errors, subject, res){
	if(errorIsPresent("instance not unique", errors)) 
		return response(409, { message: `${subject} already exists`}, res);

	if(errorIsPresent("transaction aborted", errors))
		return response(500, { message: "Service Error" }, res);

	if(errorIsPresent("instance not found", errors))
		return response(404, { message: `Could not find ${subject}` }, res);

	throw errors;
}

/**
 * Check if a specific error exists within an error response from FaunaDB GraphQL.
 * @param {String}  error - The error to find.
 * @param {Array} errorsArray - An array of errors returned from FaunaDB GraphQL.
 */
function errorIsPresent(error, errorsArray){
	return [...errorsArray].some( item => item.extensions.code === error);
}

module.exports = gqlErrors;