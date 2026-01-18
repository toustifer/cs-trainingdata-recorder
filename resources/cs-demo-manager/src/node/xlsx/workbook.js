import path from 'node:path';
import archiver from 'archiver';
import fs from 'node:fs/promises';
import os from 'node:os';
import { createWriteStream } from 'node:fs';
import { randomUUID } from 'node:crypto';
/**
 * XLSX file generator with low memory footprint in mind.
 *
 * CS:DM only needs to write large XLSX files that may contain A LOT of rows, we don't need styling, filtering...
 * Most XLSX libs hold all data cells in memory to be able to edit them later (formatting, styling...).
 * As a result it may consume a lot of memory, that's why this class exists.
 *
 * A XLSX file is a zip archive that contains several XML files, see https://docs.microsoft.com/en-us/openspecs/office_standards/ms-xlsx/f780b2d6-8252-4074-9fe3-5d7bc4830968
 * This class writes all XML files in a temporary folder and when done compress it to generate the final XLSX file.
 * - Only the required XML files to have a valid XLSX file are generated.
 * - Cell values are not hold in memory, they are streamed to the corresponding sheet XML file.
 * - Cell strings are stored "in-line" instead of the Excel "shared strings" structure.
 *   It makes the XML file bigger but decrease RAM usage and it will be "migrated" by Excel on save.
 *
 * Basic usage:
 * const workbook = new Workbook();
 * workbook.addSheet('Sheet1');
 * workbook.addRowToSheet('Sheet1', ['Cell1', 'Cell2', 'Cell3']);
 * await workbook.write('my-file.xlsx');
 */
export class Workbook {
    tempFolderPath = path.join(os.tmpdir(), randomUUID());
    sheets = [];
    async initialize() {
        await this.createTempFolder();
    }
    addSheet(name) {
        if (this.sheets.some((sheet) => sheet.name === name)) {
            throw new Error(`Sheet with name ${name} already exists`);
        }
        const xmlFilePath = path.join(this.tempFolderPath, 'xl', 'worksheets', `sheet${this.sheets.length + 1}.xml`);
        const fileStream = createWriteStream(xmlFilePath, {
            flags: 'a',
        });
        fileStream.write('<?xml version="1.0"?><worksheet mc:Ignorable="x14ac" xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"><sheetData>');
        this.sheets.push({
            name,
            fileStream,
            rowCount: 1,
        });
    }
    addRowToSheet(sheetName, cells) {
        const sheet = this.sheets.find((sheet) => sheet.name === sheetName);
        if (sheet === undefined) {
            throw new Error(`Sheet with name ${sheetName} doesn't exists, did you forget to call addSheet()?`);
        }
        let xml = `<row r="${sheet.rowCount}">`;
        for (const [cellIndex, cell] of cells.entries()) {
            const type = typeof cell === 'number' ? 'n' : 'inlineStr';
            const letter = this.getColumnLetterFromColumnNumber(cellIndex + 1);
            xml += `<c r="${letter}${sheet.rowCount}" t="${type}">`;
            if (type === 'inlineStr') {
                let value;
                if (typeof cell === 'boolean') {
                    value = Number(cell);
                }
                else if (cell instanceof Date) {
                    value = this.formatDate(cell);
                }
                else {
                    value = this.sanitizeString(cell.toString());
                }
                xml += `<is><t>${value}</t></is>`;
            }
            else {
                xml += `<v>${cell}</v>`;
            }
            xml += '</c>';
        }
        xml += '</row>';
        sheet.fileStream.write(xml);
        sheet.rowCount++;
    }
    async write(destinationPath) {
        for (const sheet of this.sheets) {
            sheet.fileStream.write('</sheetData></worksheet>');
            sheet.fileStream.close();
        }
        await Promise.all([
            this.writeRootXML(),
            this.writeRootRelationsXml(),
            this.writeWorkbookXML(),
            this.writeWorkbookRelationsXml(),
        ]);
        await this.generateXlsxFile(destinationPath);
        await this.release();
    }
    async release() {
        for (const sheet of this.sheets) {
            sheet.fileStream.close();
        }
        this.sheets = [];
        await this.deleteTempFolder();
    }
    // [Content_Types].xml
    async writeRootXML() {
        let xml = `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default ContentType="application/xml" Extension="xml"/><Default ContentType="application/vnd.openxmlformats-package.relationships+xml" Extension="rels"/><Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" PartName="/xl/workbook.xml"/>`;
        for (let i = 1; i <= this.sheets.length; i++) {
            xml += `<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" PartName="/xl/worksheets/sheet${i}.xml"/>`;
        }
        xml += '</Types>';
        await fs.writeFile(`${this.tempFolderPath}/[Content_Types].xml`, xml);
    }
    // xl/_rels/workbook.xml.rels
    async writeWorkbookRelationsXml() {
        let xml = `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">`;
        for (let i = 1; i <= this.sheets.length; i++) {
            xml += `<Relationship Id="rId${i}" Target="worksheets/sheet${i}.xml" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet"/>`;
        }
        xml += '</Relationships>';
        await fs.writeFile(`${this.tempFolderPath}/xl/_rels/workbook.xml.rels`, xml);
    }
    // ./_rels/.rels
    async writeRootRelationsXml() {
        const xml = `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Target="xl/workbook.xml" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument"/></Relationships>`;
        await fs.writeFile(`${this.tempFolderPath}/_rels/.rels`, xml);
    }
    // ./workbook.xml
    async writeWorkbookXML() {
        let xml = `<?xml version="1.0" encoding="UTF-8"?><workbook mc:Ignorable="x15" xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main"><sheets>`;
        for (let i = 0; i < this.sheets.length; i++) {
            xml += `<sheet name="${this.sheets[i].name}" r:id="rId${i + 1}" sheetId="${i + 1}"/>`;
        }
        xml += '</sheets></workbook>';
        await fs.writeFile(`${this.tempFolderPath}/xl/workbook.xml`, xml);
    }
    generateXlsxFile(destinationPath) {
        return new Promise((resolve, reject) => {
            const output = createWriteStream(destinationPath);
            output.on('close', () => {
                resolve();
            });
            const zip = archiver('zip');
            zip.on('error', (error) => {
                reject(error);
            });
            zip.directory(this.tempFolderPath, false);
            zip.pipe(output);
            zip.finalize();
        });
    }
    /**
     * Returns the column letter used by Excel from its number (A1, B10, D4...).
     * See https://docs.microsoft.com/en-us/office/troubleshoot/excel/convert-excel-column-numbers
     */
    getColumnLetterFromColumnNumber(columnNumber) {
        const aCharCode = 65;
        let columnName = '';
        let remaining = columnNumber;
        while (remaining > 0) {
            const mod = (remaining - 1) % 26;
            columnName = String.fromCodePoint(aCharCode + mod) + columnName;
            remaining = (remaining - 1 - mod) / 26;
        }
        return columnName;
    }
    async createTempFolder() {
        await fs.mkdir(`${this.tempFolderPath}/_rels`, { recursive: true });
        await fs.mkdir(`${this.tempFolderPath}/xl/_rels`, { recursive: true });
        await fs.mkdir(`${this.tempFolderPath}/xl/worksheets`, { recursive: true });
    }
    async deleteTempFolder() {
        await fs.rm(this.tempFolderPath, { recursive: true, force: true });
    }
    sanitizeString(str) {
        return str
            .replace(/(?!&([^ &;]*);)&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
    formatDate(date) {
        return date.toLocaleDateString('fr-CA');
    }
}
//# sourceMappingURL=workbook.js.map