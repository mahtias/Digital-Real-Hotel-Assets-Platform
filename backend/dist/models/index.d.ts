import { Sequelize } from 'sequelize-typescript';
import { User } from './User';
import { Property } from './Property';
import { Token } from './Token';
import { Investment } from './Investment';
import { Transaction } from './Transaction';
import { Booking } from './Booking';
declare const sequelize: Sequelize;
export { sequelize, User, Property, Token, Investment, Transaction, Booking, };
export declare const db: {
    sequelize: Sequelize;
    User: typeof User;
    Property: typeof Property;
    Token: typeof Token;
    Investment: typeof Investment;
    Transaction: typeof Transaction;
    Booking: typeof Booking;
};
export default db;
//# sourceMappingURL=index.d.ts.map