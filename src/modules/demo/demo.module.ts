import { Module } from '@nestjs/common';
import { CloudinaryService } from '../../common/services/cloudinary.service';
import { DemoController } from './demo.controller';
import { DemoService } from './demo.service';

@Module({
  controllers: [DemoController],
  providers: [DemoService, CloudinaryService],
})
export class DemoModule { }
