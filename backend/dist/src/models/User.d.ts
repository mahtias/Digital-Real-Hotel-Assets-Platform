import { Model } from 'sequelize-typescript';
import { UserRole } from '@prisma/client';
export declare class User extends Model {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role: UserRole;
    isEmailVerified: boolean;
    isActive: boolean;
    lastLogin?: Date;
    preferences: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    isVerified: boolean;
    walletAddress: string;
}
//# sourceMappingURL=User.d.ts.map