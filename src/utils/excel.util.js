import { utils as XLSXUtils, writeFile } from 'xlsx';
const path = require('path');
const fs = require("fs");
const https = require("https");

module.exports.exportToExcel = (data, workSheetColumnNames, workSheetName, filePath) => {
    // const workBook = xlsx.utils.book_new();
    const workSheetData = [
        workSheetColumnNames,
        ...data
    ];
    // console.log('workSheetData :>> ', workSheetData);
    // const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
    // xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
    // xlsx.writeFile(workBook, path.resolve(filePath));

    // const ws = XLSXUtils.json_to_sheet(workSheetData);
    // const wb = XLSXUtils.book_new();
    // XLSXUtils.book_append_sheet(wb, ws, workSheetName);
    // writeFile(wb, `${filePath}.xlsx`);
}

module.exports.importToExcel = () => {


}