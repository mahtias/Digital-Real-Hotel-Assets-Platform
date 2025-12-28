import { Model } from 'sequelize-typescript';
import { User } from './User';
import { Property } from './Property';
export declare class Booking extends Model {
    id: string;
    userId: string;
    propertyId: string;
    checkIn: Date;
    checkOut: Date;
    user?: User;
    property?: Property;
}
//# sourceMappingURL=Booking.d.ts.map