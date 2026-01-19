import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { LoginDto, SignUpDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    /// Signup method
    async signup(signUpData: SignUpDto) {
        // hash password
        const hashedPassword = await argon2.hash(signUpData.password);

        // create user
        const user = await this.usersService.create({
            ...signUpData,
            password: hashedPassword,
        });


        return user;
    }

    /// Login method
    async login(loginData: LoginDto) {
        // find user by email
        const user = await this.usersService.findByEmail(loginData.email);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        // verify password
        const isPasswordValid = await argon2.verify(user.password, loginData.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        const payload = { userId: user._id.toString(), role: user.role };
        const accessToken = this.jwtService.sign(payload);
        return {
            statusCode: 200,
            success: true,
            message: 'Login successful',
            token: accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        };
    }
}
