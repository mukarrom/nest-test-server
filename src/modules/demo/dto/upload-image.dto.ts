import { IsNotEmpty, IsString } from 'class-validator';

export class UploadImageDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}
