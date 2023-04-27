const fs = require('fs');
const os = require('os');
const path = require('path');
const { exec } = require('child_process');

function openImageInViewer(imageBuffer) {
    return new Promise((resolve, reject) => {
        const tempDir = os.tmpdir();
        const randomFilename = Math.random().toString(36).substr(2, 8) + '.jpg';
        const tempFilePath = path.join(tempDir, randomFilename);

        fs.writeFile(tempFilePath, imageBuffer, (err) => {
            if (err) {
                reject(new Error('Error writing temporary file: ' + err));
                return;
            }

            exec(`open "${tempFilePath}"`, (err, stdout, stderr) => {
                if (err) {
                    reject(new Error('Error opening image in default viewer: ' + err));
                    return;
                }

                resolve('Image opened in default viewer');
            });
        });
    });
}

module.exports = { openImageInViewer };