import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ExcelService } from './excel.service';
import * as path from 'path';
import * as fs from 'fs';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('excel')
@Public()
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Get('generate')
  async generateExcel(@Body() body: { items: any[] }) {
    const jobId = await this.excelService.generateExcel();
    return { jobId, message: 'Excel generation started' };
  }

  @Get('status/:jobId')
  async getStatus(@Param('jobId') jobId: number) {
    const status = await this.excelService.getJobStatus(jobId);
    if (!status) {
      return { message: 'Job not found' };
    }
    return status;
  }

  @Get('download/:fileName')
  async downloadFile(@Param('fileName') fileName: string,) {
    const filePath = path.resolve(__dirname, '..', 'exports', fileName);

    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }

    return {
        success: true,
        fileName: filePath
    }
  }
}
