import { Role } from "src/common/enums/roles.enum";

/**
 * JWT Payload interface
 * This is what gets encoded in the JWT token
 */
export interface JwtPayload {
    userId: string;           // User/Auth ID
    role: Role;            // User role
    iat?: number;          // Issued at
    exp?: number;          // Expiration
}