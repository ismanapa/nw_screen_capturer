import * as fs from 'fs';

export default class Fsys {

    static getStoredFiles(ext) {
        return fs.readdirSync('.')
            .filter((file) => fs.statSync(file).isFile()
                && file.endsWith(ext)) || [];
    }

    saveFile(filenameRaw, data, ext) {
        const files = Fsys.getStoredFiles(ext),
            // Generate filename of the pattern like screenshot5.png 
            filename = filenameRaw.replace('{N}', files.length + 1);
        fs.writeFileSync(filename, data, 'base64');
        return filename;
    }
} 