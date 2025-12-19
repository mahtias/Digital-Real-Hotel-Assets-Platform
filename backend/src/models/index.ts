import { Sequelize } from 'sequelize-typescript';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Import models
import { User } from './User';
import { KYC } from './KYC';
import { Property } from './Property';
import { Token } from './Token';
import { Investment } from './Investment';
import { Transaction } from './Transaction';
import { Booking } from './Booking';

// Initialize Sequelize with Neon PostgreSQL
const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  models: [User, KYC, Property, Token, Investment, Transaction, Booking],
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Test connection
sequelize
  .authenticate()
  .then(() => {
    console.log('PostgreSQL (Neon) connected successfully');
  })
  .catch((error) => {
    console.error(' Unable to connect to database:', error);
    process.exit(1);
  });

// Export models and sequelize instance
export { sequelize, User, KYC, Property, Token, Investment, Transaction, Booking };

// Export db object for compatibility
export const db = {
  sequelize,
  User,
  KYC,
  Property,
  Token,
  Investment,
  Transaction,
  Booking,
};

export default db;
