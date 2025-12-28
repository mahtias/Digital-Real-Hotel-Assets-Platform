import { Sequelize } from 'sequelize-typescript';

import dotenv from 'dotenv';

dotenv.config();

// Import models
import { User } from './User';
//import { KYC } from './KYC';
import { Property } from './Property';
import { Token } from './Token';
import { Investment } from './Investment';
import { Transaction } from './Transaction';
import { Booking } from './Booking';

// LOG connection target
console.log("Sequelize connecting to:", process.env.DATABASE_URL);

// Initialize Sequelize for LOCAL PostgreSQL (no SSL)
const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,

  //  VERY IMPORTANT: Disable SSL so Sequelize does NOT connect to Neon
  dialectOptions: {
    ssl: false,
  },

  models: [User, Property, Token, Investment, Transaction, Booking],

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
    console.log('PostgreSQL (LOCAL) connected successfully');
  })
  .catch((error) => {
    console.error('Unable to connect to LOCAL PostgreSQL:', error);
    process.exit(1);
  });

// Export models and sequelize instance
export {
  sequelize,
  User,
  Property,
  Token,
  Investment,
  Transaction,
  Booking,
};

// Export db object for compatibility
export const db = {
  sequelize,
  User,
  
  Property,
  Token,
  Investment,
  Transaction,
  Booking,
};

export default db;
