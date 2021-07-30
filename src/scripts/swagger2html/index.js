#!/usr/bin/env node

const path = require('path');
const { promises } = require('fs');
const file = process.argv[2];
const target = process.argv[3];

const run = async () => {
    const template = await promises.readFile(`${__dirname}/template.html`);

    const fileType = path.extname(file);

    if (fileType !== '.json') {
        console.error(
            `File type ${fileType} not supported. Supported file types: json.`
        );
        process.exit(-1);
    }

    const swaggerSpec = JSON.parse(await promises.readFile(file, 'utf8'));

    const directory = [...target.split('/').slice(0, -1)].join('/');

    try {
        await promises.stat(directory);
    } catch (e) {
        await promises.mkdir(directory, { recursive: true });
    }

    const output = template
        .toString()
        .replace("'{{spec}}'", JSON.stringify(swaggerSpec));

    await promises.writeFile(target, output);

    console.log('Swagger docs generated');
};

run();
