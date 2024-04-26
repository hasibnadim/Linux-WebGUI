const fs = require('fs');
const path = require('path');

let sourcePath = path.join(__dirname,"..", '.env');
let destinationPath = path.join(__dirname,"..", 'executable', '.env');
if(process.argv[2] === 'setup'){
    sourcePath = path.join(__dirname,"..", '.env-example');
    destinationPath = path.join(__dirname,"..", '.env');
}
fs.copyFile(sourcePath, destinationPath, (err) => {
    if (err) {
        console.error('Error copying .env file:', err);
    } else {
        console.log('.env file copied successfully!');
    }
});