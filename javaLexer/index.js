const _ = require("lodash");

/**
 * Performs a full tokenization of a java file.
 * Please note current limitations with the lexer:
 *  - This currently ONLY tokenizes functions within interfaces
 *  - This will only understand and tokenize JAVADOC spec documentation.
 * @param {string} inputFile - input file for processing.
 */
exports.tokenize = (inputFile) => {
	const matchFunctionWithDoc =
		/\/\*\*([^\*]|\*(?!\/))*\*\/[\s]*(boolean|int|String|void) \w+\(.*?\);/gms;

	let tokenizedFileByFunctionWithDoc;
	const functionsWithDocs = [];
	while ((tokenizedFileByFunctionWithDoc = matchFunctionWithDoc.exec(inputFile)) !== null) {
		functionsWithDocs.push(tokenizeFunctionWithDoc(tokenizedFileByFunctionWithDoc[0]));
	}

	return {
		functionsWithDocs: functionsWithDocs
	};
};

/**
 * Tokenizes both the function signature and the documentation.
 * @param {*} functionText
 */
const tokenizeFunctionWithDoc = (functionText) => {
	const matchDocumentation = /\/\*\*([^\*]|\*(?!\/))*\*\//gm;
	const matchSignature = /\w+ \w+\(.*?\);/g;

	const documentationToken = matchDocumentation.exec(functionText);
	const documentationText = documentationToken && documentationToken[0];

	const signatureToken = matchSignature.exec(functionText);
	const signatureText = signatureToken && signatureToken[0];

	return {
		signature: tokenizeFunctionSignature(signatureText),
		documentation: tokenizeFunctionDocumentation(documentationText)
	};
};

/**
 * Tokenizes the signature of a function.
 * @param {*} signatureText - the string representation of a signature.
 * @returns the tokenized signature.
 */
const tokenizeFunctionSignature = (signatureText) => {
	const matchReturnType = /\w+ /g;
	const matchFunctionName = /\w+\s*\(/g;
	const matchFunctionParameters = /\(([^\)]+)\)/g;

	const returnTypeToken = matchReturnType.exec(signatureText);
	const returnTypeText = returnTypeToken && returnTypeToken[0];

	const functionNameToken = matchFunctionName.exec(signatureText);
	const functionNameText = functionNameToken && functionNameToken[0];

	const functionParametersToken = matchFunctionParameters.exec(signatureText);
	const functionParametersText = functionParametersToken && functionParametersToken[0];

	/**
	 * Tokenizes function parameter text.
	 * @param {string} functionParametersText - the function parameters as a string.
	 * @returns the tokenized function parameters
	 */
	const tokenizeFunctionParameters = (functionParametersText) => {
		const trimmedFunctionParametersText = _.trim(functionParametersText, "()");
		return _.map(_.split(trimmedFunctionParametersText, ","), (functionParameter) => {
			const trimmedFunctionParameter = _.trim(functionParameter);
			const parameterNameAndReturnType = _.split(trimmedFunctionParameter, " ");
			return {
				parameterReturnType: parameterNameAndReturnType[0],
				parameterName: parameterNameAndReturnType[1]
			};
		});
	};

	return {
		functionSignature: signatureText,
		functionReturnType: _.trim(returnTypeText),
		functionName: _.trim(functionNameText, "()"),
		functionParameters: tokenizeFunctionParameters(functionParametersText)
	};
};

/**
 *
 * @param {*} documentationText
 * @returns
 */
const tokenizeFunctionDocumentation = (documentationText) => {
	const matchFunctionDescription = /\w+\s*\(/g;
	const matchReturnDocumentation = /@return[ \t]+[\w\s]+/g;
	const matchFunctionParameters = /@param[ \t]+[\w\s]+/g;

	let parameterDocumentationToken;
	const parameterDocumentationText = [];
	while (
		(parameterDocumentationToken = matchFunctionParameters.exec(documentationText)) !== null
	) {
		const trimmedParameterDocumentationToken = _.trim(
			_.trimStart(parameterDocumentationToken[0], "@param")
		);
		parameterDocumentationText.push(trimmedParameterDocumentationToken);
	}

	const returnDocumentationToken = matchReturnDocumentation.exec(documentationText);
	const returnDocumentationText = returnDocumentationToken && returnDocumentationToken[0];

	return {
		functionDocumentation: "",
		parameterDocumentation: parameterDocumentationText,
		returnDocumentation: _.trim(_.trimStart(returnDocumentationText, "@return|@returns"))
	};
};
