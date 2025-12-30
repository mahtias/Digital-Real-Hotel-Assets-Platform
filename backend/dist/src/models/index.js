"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.Booking = exports.Transaction = exports.Investment = exports.Token = exports.Property = exports.User = exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const User_1 = require("./User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
const Property_1 = require("./Property");
Object.defineProperty(exports, "Property", { enumerable: true, get: function () { return Property_1.Property; } });
const Token_1 = require("./Token");
Object.defineProperty(exports, "Token", { enumerable: true, get: function () { return Token_1.Token; } });
const Investment_1 = require("./Investment");
Object.defineProperty(exports, "Investment", { enumerable: true, get: function () { return Investment_1.Investment; } });
const Transaction_1 = require("./Transaction");
Object.defineProperty(exports, "Transaction", { enumerable: true, get: function () { return Transaction_1.Transaction; } });
const Booking_1 = require("./Booking");
Object.defineProperty(exports, "Booking", { enumerable: true, get: function () { return Booking_1.Booking; } });
console.log("Sequelize connecting to:", process.env.DATABASE_URL);
const sequelize = new sequelize_typescript_1.Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
        ssl: false,
    },
    models: [User_1.User, Property_1.Property, Token_1.Token, Investment_1.Investment, Transaction_1.Transaction, Booking_1.Booking],
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});
exports.sequelize = sequelize;
sequelize
    .authenticate()
    .then(() => {
    console.log('PostgreSQL (LOCAL) connected successfully');
})
    .catch((error) => {
    console.error('Unable to connect to LOCAL PostgreSQL:', error);
    process.exit(1);
});
exports.db = {
    sequelize,
    User: User_1.User,
    Property: Property_1.Property,
    Token: Token_1.Token,
    Investment: Investment_1.Investment,
    Transaction: Transaction_1.Transaction,
    Booking: Booking_1.Booking,
};
exports.default = exports.db;
//# sourceMappingURL=index.js.map