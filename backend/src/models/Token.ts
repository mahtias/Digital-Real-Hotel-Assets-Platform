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
import { Property } from './Property';

@Table({
  tableName: 'tokens',
  timestamps: true,
})
export class Token extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => Property)
  @Column(DataType.UUID)
  propertyId!: string;

  @Column(DataType.STRING)
  contractAddress?: string;

  @BelongsTo(() => Property)
  property?: Property;
}
