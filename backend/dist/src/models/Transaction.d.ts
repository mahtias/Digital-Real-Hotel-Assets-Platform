import { Model } from 'sequelize-typescript';
import { User } from './User';
export declare class Transaction extends Model {
    id: string;
    userId: string;
    txHash: string;
    type: string;
    user?: User;
}
//# sourceMappingURL=Transaction.d.ts.map