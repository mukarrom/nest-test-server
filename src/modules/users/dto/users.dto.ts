import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from "class-validator";

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsPhoneNumber()
    phone?: string;
}

export class ChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    currentPassword: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    newPassword: string;
}
