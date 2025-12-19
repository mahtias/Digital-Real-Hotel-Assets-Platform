import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './User';
import { Property } from './Property';

@Table({
  tableName: 'bookings',
  timestamps: true,
})
export class Booking extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;

  @ForeignKey(() => Property)
  @Column(DataType.UUID)
  propertyId!: string;

  @Column(DataType.DATEONLY)
  checkIn!: Date;

  @Column(DataType.DATEONLY)
  checkOut!: Date;

  @BelongsTo(() => User)
  user?: User;

  @BelongsTo(() => Property)
  property?: Property;
}
