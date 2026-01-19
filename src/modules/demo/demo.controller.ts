import {
    BadRequestException,
    Body,
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DemoService } from './demo.service';
import { UploadImageDto } from './dto/upload-image.dto';

@Controller('demo')
export class DemoController {
    constructor(private readonly demoService: DemoService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('image'))
    async uploadImage(
        @UploadedFile() file: Express.Multer.File,
        @Body() uploadImageDto: UploadImageDto,
    ) {
        if (!file) {
            throw new BadRequestException('Image file is required');
        }

        return this.demoService.uploadImage(
            file,
            uploadImageDto.title,
            uploadImageDto.description,
        );
    }
}
