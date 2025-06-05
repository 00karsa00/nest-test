import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Workbook } from 'exceljs';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { Public } from './common/decorators/public.decorator';
import { Worker } from 'worker_threads';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('download')
  @Public()
  async getFile(res: Response) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('My Sheet');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Age', key: 'age', width: 10 },
    ];

    worksheet.addRow({ id: 1, name: 'Alice', age: 25 });
    worksheet.addRow({ id: 2, name: 'Bob', age: 30 });
    worksheet.addRow({ id: 3, name: 'Charlie', age: 28 });
    worksheet.addRow({ id: 2, name: 'Bob', age: 30 });
    worksheet.addRow({ id: 3, name: 'Charlie', age: 28 });
    worksheet.addRow({ id: 2, name: 'Bob', age: 30 });
    worksheet.addRow({ id: 3, name: 'Charlie', age: 28 });
    worksheet.addRow({ id: 2, name: 'Bob', age: 30 });
    worksheet.addRow({ id: 3, name: 'Charlie', age: 28 });
    worksheet.addRow({ id: 2, name: 'Bob', age: 30 });
    worksheet.addRow({ id: 3, name: 'Charlie', age: 28 });
    worksheet.addRow({ id: 2, name: 'Bob', age: 30 });
    worksheet.addRow({ id: 3, name: 'Charlie', age: 28 });
    worksheet.addRow({ id: 2, name: 'Bob', age: 30 });
    worksheet.addRow({ id: 3, name: 'Charlie', age: 28 });
    worksheet.addRow({ id: 2, name: 'Bob', age: 30 });
    worksheet.addRow({ id: 3, name: 'Charlie', age: 28 });
    worksheet.addRow({ id: 2, name: 'Bob', age: 30 });
    worksheet.addRow({ id: 3, name: 'Charlie', age: 28 });
    worksheet.addRow({ id: 2, name: 'Bob', age: 30 });
    worksheet.addRow({ id: 3, name: 'Charlie', age: 28 });
    worksheet.addRow({ id: 2, name: 'Bob', age: 30 });
    worksheet.addRow({ id: 3, name: 'Charlie', age: 28 });
    worksheet.addRow({ id: 2, name: 'Bob', age: 30 });
    worksheet.addRow({ id: 3, name: 'Charlie', age: 28 });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer(); 

    const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
    const filename = `report_${timestamp}.xlsx`;
    await workbook.xlsx.writeFile(filename);
    // Send buffer as response
    return {
      success: true,
      message: 'successfully downloade'
    }
  }


  @Get('download-large-excel')
  @Public()
  async downloadExcel() {
    //      const filePath = path.join(__dirname, '../../', 'assets', 'large_sample.json');
    //   const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    //   const workbook = new Workbook();
    // const worksheet = workbook.addWorksheet('Data');

    // // Dynamically get all keys for columns
    // const columns = Object.keys(jsonData[0]).map((key) => ({
    //   header: key,
    //   key: key,
    //   width: 15,
    // }));
    // worksheet.columns = columns;

    // // Add all rows
    // // jsonData.forEach((record) => {
    // //   worksheet.addRow(record);
    // // });

    // for (const record of jsonData) {
    //     worksheet.addRow(record);
    //   }

    // const borderStyles: any = {
    //   top: { style: 'medium' },
    //   left: { style: 'medium' },
    //   bottom: { style: 'medium' },
    //   right: { style: 'medium' }
    // }

    // worksheet.eachRow((cell, rowNumber) => {
    //   worksheet.getRow(rowNumber).eachCell({ includeEmpty: true }, (cell_v, colNumber) => {
    //     if (colNumber <= worksheet.columnCount) {
    //       cell_v.border = borderStyles;
    //     }
    //   })
    // })

    // // Set headers for file download
    // const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
    // const filename = `report_${timestamp}.xlsx`;
    // await workbook.xlsx.writeFile(filename);

    // return {
    //   success: true,
    //   message: 'file generated'
    // }
    return new Promise(async (resolve, reject) => {
      const filePath = path.join(__dirname, '../../', 'assets', 'large_sample.json');
      const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const workerPath = path.join(__dirname, 'excel.worker.js');
      const worker = new Worker(workerPath, { workerData: jsonData });
      worker.on('message', (msg) => {
        console.log('msg => ', msg)

        if (msg.success) {
          resolve({
            filename: msg.filePath,
            success: true,
            message: 'successfully generateed'
          })
        }
        else {
          resolve({
            success: false,
            message: 'falied generateed'
          })
        }
      });

      worker.on('error', (error) => {
        console.log('error => ', error)
        resolve({
          success: false,
          message: 'falied generateed'
        })
      });
      worker.on('exit', (code) => {
        console.log('code => ', code)
        
        if (code !== 0) {
          resolve({
            success: false,
            message: `Worker exited with code ${code}`
          })
        }
      });

    })
  }
}
