import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    /**
     * Validates the JWT payload and returns the user object
     * This user object is attached to request.user
     */
    async validate(payload: JwtPayload): Promise<JwtPayload> {
        // Fetch user from database to check password change timestamp
        const user = await this.usersService.findById(payload.userId);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('User account is not active');
        }

        if (user.isDeleted) {
            throw new UnauthorizedException('User account has been deleted');
        }

        // Check if token was issued before password was changed
        if (user.passwordChangedAt && payload.iat) {
            // Convert Date to Unix timestamp (in seconds) for comparison
            // const passwordChangedTimestamp = Math.floor(user.passwordChangeAt.getTime() / 1000);
            const passwordChangedTimestamp = new Date(user.passwordChangedAt).getTime() / 1000;
            // If password was changed after token was issued, invalidate the token
            if (passwordChangedTimestamp > payload.iat) {
                throw new UnauthorizedException('Password was changed. Please login again.');
            }
        }

        return {
            userId: payload.userId,
            role: payload.role,
            iat: payload.iat,
            exp: payload.exp,
        };
    }
}
