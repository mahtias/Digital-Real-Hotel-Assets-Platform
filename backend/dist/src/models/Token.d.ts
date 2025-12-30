import { Model } from 'sequelize-typescript';
import { Property } from './Property';
export declare class Token extends Model {
    id: string;
    propertyId: string;
    contractAddress?: string;
    property?: Property;
}
//# sourceMappingURL=Token.d.ts.map