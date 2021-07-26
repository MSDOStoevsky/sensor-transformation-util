#!/usr/bin/env node
const yargs = require("yargs")
	.usage(`Usage: npx transform [-java] path/to/InputFile.java`)
	.describe({
		java: "File is a java file"
	})
	.boolean(["java", "s"])
	.help()

const argv = yargs.argv;

if (argv._.length < 1) {
	yargs.showHelp();
} else {
	const inputFile = argv._[0];

	require("./index").transform(inputFile, !argv.java);
}
