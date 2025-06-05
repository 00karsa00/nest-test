import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ExcelService } from './excel.service';
import { ExcelProcessor } from './excel.processor';
import { ExcelController } from './excel.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'excel-generation',
    }),
  ],
  providers: [ExcelService, ExcelProcessor],
  controllers: [ExcelController],
  exports: [ExcelService],
})
export class ExcelModule {}
