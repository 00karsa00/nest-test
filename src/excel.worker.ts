import { workerData, parentPort } from 'worker_threads';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';

(async () => {
    console.log('start ....')
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Report');


    // Dynamically get all keys for columns
    const columns = Object.keys(workerData[0]).map((key) => ({
      header: key,
      key: key,
      width: 15,
    }));
    sheet.columns = columns;
  // Add all rows
    workerData.forEach((record) => {
      sheet.addRow(record); 
    });


    const borderStyles: any = {
      top: { style: 'medium' },
      left: { style: 'medium' },
      bottom: { style: 'medium' },
      right: { style: 'medium' }
    }

    //  sheet.eachRow((cell, rowNumber) => {
    //   sheet.getRow(rowNumber).eachCell({ includeEmpty: true }, (cell_v, colNumber) => {
    //     if (colNumber <= sheet.columnCount) {
    //       cell_v.border = borderStyles;
    //     }
    //   })
    // })
    console.log('file ....')


  // Write file to disk
  const filePath = path.join(__dirname,'../../src' ,`report-${Date.now()}.xlsx`);
    console.log('file1 ....')
    try {

      // // await workbook.xlsx.writeFile(filePath);
      //  const buffer = await workbook.xlsx.writeBuffer();
      //  fs.writeFileSync('output.xlsx', buffer);

     const buffer : any= await workbook.xlsx.writeBuffer();

    // Save buffer to file
    fs.writeFileSync('output.xlsx', buffer);

    } catch(error) {
      console.log('error')
    }
    console.log('file 2....')

  console.log('end ....')

  // Send file path back
  parentPort?.postMessage({ success: true, filePath });
})();



    // Add all rows
    // jsonData.forEach((record) => {
    //   worksheet.addRow(record);
    // });

    // for (const record of jsonData) {
    //     worksheet.addRow(record);
    //   }


   

    // Set headers for file download
    // const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
    // const filename = `report_${timestamp}.xlsx`;
    // await workbook.xlsx.writeFile(filename);

    // return {
    //   success: true,
    //   message: 'file generated'
    // }