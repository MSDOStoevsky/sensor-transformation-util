// AUTHOR: Dylan Lettinga
// EMAIL: msdostoevsky@protonmail.com
// CONTRIBUTORS:

const fs = require("fs");
const _ = require("lodash");
const JavaLexer = require("./javaLexer");

const BAD_FILE_TYPE_MESSAGE = "[FATAL] Your file type is not supported.";

/**
 * Main generator function.
 * @param {string} inputFile - input file for processing.
 * @param {boolean} fileType - flag to indicate file type.
 * @param {Options} options - options to manipulate the transformation.
 */
exports.transform = async (inputFile, fileType, options) => {
	let inMemoryFile = undefined;
	try {
		inMemoryFile = fs.readFileSync(inputFile, "utf8");
	} catch (error) {
		console.log(error);
	}

	let result;

	if (fileType === "java") {
		const tokenizedFile = JavaLexer.tokenize(inMemoryFile);

		switch (options.outputMethod) {
			case "console":
				result = JSON.stringify(tokenizedFile);
				break;
			case "list":
				const field = options.select;
				let fieldValues = _.map(tokenizedFile.functionsWithDocs, (functionWithDoc) => {
					return (
						_.get(functionWithDoc.signature, field) ||
						_.get(functionWithDoc.documentation, field)
					);
				});

				if (options.regex) {
					fieldValues = _.filter(fieldValues, (fieldValue) => {
						const userCriteria = new RegExp(options.regex, "g");
						return userCriteria.test(fieldValue);
					});
				}

				result = _.join(fieldValues, "\n");

				break;
			default:
				result = tokenizedFile;
		}
	} else {
		console.log(BAD_FILE_TYPE_MESSAGE);
	}

	console.log(result);
};
