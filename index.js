// AUTHOR: Dylan Lettinga
// EMAIL: msdostoevsky@protonmail.com

const fs = require("fs");
const _ = require("lodash");
const JavaLexer = require("./javaLexer");

const BAD_JAVA_MESSAGE =
	"[FATAL] Something about your Java file doesn't seem right. I can't process it.";

/**
 * Main generator function.
 * @param {string} inputFile - input file for processing.
 * @param {boolean} isJava - flag to indicate file is java file.
 */
exports.transform = async (inputFile, isJava) => {
	let inMemoryFile = undefined;
	try {
		inMemoryFile = fs.readFileSync(inputFile, "utf8");
	} catch (error) {
		console.log(error);
		return console.log(BAD_JAVA_MESSAGE);
	}

	let tokenizedFile;
	if (isJava) {
		tokenizedFile = JavaLexer.tokenize(inMemoryFile);
	}
	console.log(JSON.stringify(tokenizedFile));
};
