import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../../common/services/cloudinary.service';

@Injectable()
export class TestService {
    constructor(private readonly cloudinaryService: CloudinaryService) { }

    async uploadImage(
        file: Express.Multer.File,
        title: string,
        description: string,
    ) {
        const imageUrl = await this.cloudinaryService.uploadImage(file);

        return {
            title,
            description,
            imageUrl,
            uploadedAt: new Date(),
        };
    }
}
