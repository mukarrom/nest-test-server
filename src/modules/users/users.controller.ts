import { Body, Controller, Get, Patch, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ChangePasswordDto, UpdateProfileDto } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Req() req: any) {
        return await this.usersService.getProfile(req.user.userId);
    }

    @Patch('profile')
    @UseGuards(JwtAuthGuard)
    async updateProfile(@Req() req: any, @Body() updateProfileDto: UpdateProfileDto) {
        return await this.usersService.updateProfile(req.user.userId, updateProfileDto);
    }

    @Put('change-password')
    @UseGuards(JwtAuthGuard)
    async changePassword(@Req() req: any, @Body() changePasswordDto: ChangePasswordDto) {
        return await this.usersService.changePassword(req.user.userId, changePasswordDto);
    }
}

