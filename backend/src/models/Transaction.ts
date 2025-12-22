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

@Table({
  tableName: 'transactions',
  timestamps: true,
})
export class Transaction extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;

  @Column(DataType.STRING)
  txHash!: string;

  @Column(DataType.STRING)
  type!: string;

  @BelongsTo(() => User)
  user?: User;
}
