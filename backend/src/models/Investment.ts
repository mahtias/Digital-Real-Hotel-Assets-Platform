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
  tableName: 'investments',
  timestamps: true,
})
export class Investment extends Model {
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

  @Column(DataType.DECIMAL(20, 8))
  amount!: number;

  @BelongsTo(() => User)
  user?: User;

  @BelongsTo(() => Property)
  property?: Property;
}
