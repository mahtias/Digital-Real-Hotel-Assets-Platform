import { Model } from 'sequelize-typescript';
import { User } from './User';
import { Property } from './Property';
export declare class Investment extends Model {
    id: string;
    userId: string;
    propertyId: string;
    amount: number;
    user?: User;
    property?: Property;
}
//# sourceMappingURL=Investment.d.ts.map