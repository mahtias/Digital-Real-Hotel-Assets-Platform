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

export enum PropertyStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  ACTIVE = 'active',
  FUNDED = 'funded',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Table({
  tableName: 'properties',
  timestamps: true,
})
export class Property extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.TEXT)
  description?: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  ownerId!: string;

  @Default(PropertyStatus.DRAFT)
  @Column(DataType.ENUM(...Object.values(PropertyStatus)))
  status!: PropertyStatus;

  @BelongsTo(() => User)
  owner?: User;
}
