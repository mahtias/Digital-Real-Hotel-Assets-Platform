import { Model } from 'sequelize-typescript';
import { User } from './User';
export declare enum PropertyStatus {
    DRAFT = "draft",
    PENDING = "pending",
    ACTIVE = "active",
    FUNDED = "funded",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare class Property extends Model {
    id: string;
    name: string;
    description?: string;
    ownerId: string;
    status: PropertyStatus;
    owner?: User;
}
//# sourceMappingURL=Property.d.ts.map