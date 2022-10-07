/**
 * Builds the .env file for the `application` package.
 */

import assert = require("assert");
import { writeFile } from "fs";
import path from 'path';
import PrintsterStackOutputs from '../cdk.out/PrintsterStack.outputs.json';

async function main() {
    const { databaseConnectionString } = PrintsterStackOutputs.PrintsterStack;

    const fileContent = `DATABASE_URL="${databaseConnectionString}"`;
    const filePath = path.join(`${process.cwd()}`, "../application/.env");

    await writeFile(filePath, fileContent, (error) => {
        if (error) {
            throw error;
        }
    });
}

main();