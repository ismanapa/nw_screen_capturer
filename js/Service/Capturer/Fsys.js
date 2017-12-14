import * as fs from 'fs';

const mediaDir = './media/';

export default class Fsys {

    static getStoredFiles(ext) {
        return fs.readdirSync(mediaDir)
            .filter((file) => fs.statSync(mediaDir+file).isFile()
                && file.endsWith(ext)) || [];
    }

    saveFile(filenameRaw, data, ext) {
        const files = Fsys.getStoredFiles(ext),
            // Generate filename of the pattern like screenshot5.png 
            filename = filenameRaw.replace('{N}', files.length + 1);
            console.log(files)
        fs.writeFileSync(`${mediaDir}${filename}`, data, 'base64');
        return filename;
    }
} 