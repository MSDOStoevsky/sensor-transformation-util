#!/usr/bin/env node
const yargs = require("yargs")
	.usage(
		`Usage: npx transform [--fileType="java"] [--output="console|list"] [--select="column1"] [--r="^example"] path/to/InputFile.example`
	)
	.describe({
		fileType: "The file type"
	})
	.string(["fileType", "f"])
	.string(["output", "o"])
	.string(["select", "s"])
	.string(["regex", "r"])
	.help();

const argv = yargs.argv;

if (argv._.length < 1) {
	yargs.showHelp();
} else {
	const inputFile = argv._[0];

	const options = {
		outputMethod: argv.output,
		select: argv.select,
		regex: argv.regex
	};

	require("./index").transform(inputFile, argv.fileType, options);
}
