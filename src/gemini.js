const {GoogleGenerativeAI} = require("@google/generative-ai");
const fs = require("fs-extra");
const path = require("path");
global.fetch = require('node-fetch');
global.Headers = fetch.Headers;
// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const genAI = new GoogleGenerativeAI("AIzaSyA-s7Ue49oUq6A9S0eqbeFsQ5BAJnDjQsU");
const model = genAI.getGenerativeModel({model: "gemini-1.5-pro-exp-0827"});

async function isDir(fullPath) {
    return new Promise((resolve, reject) => {
        fs.stat(fullPath, async (err, stats) => {
            if (err) {
                console.error('Error getting file stats:', err);
                return reject(err);
            }

            resolve(stats.isDirectory());
        });
    });
}

async function run() {
    await readFile("src/fn/callables/scheduled-events/assets/api.js");
}

async function readFile(directoryPath) {
    if (await isDir(directoryPath)) {
        return new Promise((resolve, reject) => {
            fs.readdir(directoryPath, async (err, files) => {
                if (err) {
                    console.error('Error reading directory:', err);
                    return;
                }

                //console.log('Files   in the directory:');
                await Promise.all(files.map(async file => {
                    const fullPath = path.join(directoryPath, file);
                    if (await isDir(fullPath)) {
                        await readFile(fullPath);
                    } else if (path.extname(file) === '.js') {
                        await process(fullPath);
                        //console.log(fullPath);
                    }
                }));
            });
        });
    } else if (path.extname(directoryPath) === '.js') {
        await process(directoryPath);
        //console.log(fullPath);
    }
}

async function process(file) {
    const result = await model.generateContent(
        [
            "Create JavaScript documentation comments from the file code you are given." +
            "Do not explain anything, just create comments and do not create your own code. Just add comments on the code I give you.",
            {
                inlineData: {
                    data: Buffer.from(file).toString("base64"),
                    mimeType: 'text/javascript',
                },
            },
        ]
    );

    let text = (await result.response.text()).replace("```javascript", "").trim();
    text = text.substring(0, text.length - 3);

    console.log(file, text);
    fs.writeFile(file.replace("src\\", "src-docs\\"), text, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return;
        }

        console.log('File has been written successfully!');
    });
}

run();