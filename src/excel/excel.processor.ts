import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Workbook } from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';

@Processor('excel-generation')
export class ExcelProcessor {
  @Process()
  async handleExcelGeneration(job: Job) {
    try {
console.log('start the file donwlidian', job)
    const { data  } = job;

    // Create a workbook
    const workbook = new Workbook();
    const sheet = workbook.addWorksheet('Sheet1');

    // Example: add some rows from data
     // Dynamically get all keys for columns
     const columns = Object.keys(data.jsonData[0]).map((key) => ({
       header: key,
       key: key,
       width: 15,
     }));
     sheet.columns = columns;
   // Add all rows
     data.jsonData.forEach((record) => {
       sheet.addRow(record); 
     });
    console.log('stawrt => aftetr')
 const borderStyles: any = {
      top: { style: 'medium' },
      left: { style: 'medium' },
      bottom: { style: 'medium' },
      right: { style: 'medium' }
    }

     sheet.eachRow((cell, rowNumber) => {
      sheet.getRow(rowNumber).eachCell({ includeEmpty: true }, (cell_v, colNumber) => {
        if (colNumber <= sheet.columnCount) {
          cell_v.border = borderStyles;
        }
      })
    })

    // Define output file path
    const fileName = `report-${job.id}.xlsx`;
    const filePath = path.resolve(__dirname, '../..', 'exports', fileName);

    // Ensure folder exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    // Write file to disk
    await workbook.xlsx.writeFile(filePath);
    console.log('complated....')
    // Return file info so it can be retrieved later
    return {
      fileName,
      filePath,
    };
    } catch(error) {
      console.log(error)
      return {
        error: true
      }
    }
    
  }
}
