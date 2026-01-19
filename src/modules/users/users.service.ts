import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { Model } from 'mongoose';
import { ChangePasswordDto, UpdateProfileDto } from './dto/users.dto';
import { User, UserDocument } from './schemas/users.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(userData: Partial<User>): Promise<UserDocument> {
        return await this.userModel.create(userData);
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return await this.userModel.findOne({ email }).exec();
    }

    async findById(id: string): Promise<UserDocument | null> {
        return await this.userModel.findById(id).exec();
    }

    async findAll(): Promise<UserDocument[]> {
        return await this.userModel.find().exec();
    }

    async update(id: string, updateData: Partial<User>): Promise<UserDocument | null> {
        return await this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    async delete(id: string): Promise<UserDocument | null> {
        return await this.userModel.findByIdAndDelete(id).exec();
    }

    async getProfile(userId: string): Promise<any> {
        const user = await this.userModel.findById(userId).select('-password').exec();
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return {
            statusCode: 200,
            success: true,
            message: 'User profile fetched successfully',
            ...user.toObject()
        };
    }

    async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<any> {
        // Check if email is being updated and if it's already taken
        if (updateProfileDto.email) {
            const existingUser = await this.userModel.findOne({
                email: updateProfileDto.email,
                _id: { $ne: userId }
            }).exec();

            if (existingUser) {
                throw new UnauthorizedException('Email already exists');
            }
        }

        const updatedUser = await this.userModel
            .findByIdAndUpdate(userId, updateProfileDto, { new: true })
            .select('-password')
            .exec();

        if (!updatedUser) {
            throw new NotFoundException('User not found');
        }

        return {
            statusCode: 200,
            success: true,
            message: 'User profile updated successfully',
            ...updatedUser.toObject()
        };
    }

    async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
        const user = await this.userModel.findById(userId).exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Verify current password
        const isPasswordValid = await argon2.verify(user.password, changePasswordDto.currentPassword);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Current password is incorrect');
        }

        // Hash new password
        const hashedPassword = await argon2.hash(changePasswordDto.newPassword);

        // Update password and passwordChangedAt timestamp
        await this.userModel.findByIdAndUpdate(userId, {
            password: hashedPassword,
            passwordChangedAt: new Date()
        }).exec();

        return { message: 'Password changed successfully' };
    }
}
