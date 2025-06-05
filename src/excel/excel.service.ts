import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ExcelService {
  constructor(@InjectQueue('excel-generation') private excelQueue: Queue) {}

  async generateExcel() {
    const filePath = path.join(__dirname, '../../..', 'assets', 'large_sample.json');
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const job = await this.excelQueue.add({ jsonData });
    return job.id; // return job ID to client
  }

  async getJobStatus(jobId: number) {
    const job = await this.excelQueue.getJob(jobId);
    if (!job) return null;

    const state = await job.getState();
    const result = job.returnvalue;

    return {
      id: job.id,
      state,
      result,
    };
  }
}
