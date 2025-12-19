import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  AllowNull,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from './User';
import { KYCStatus, VerificationLevel, DocumentType } from '../types/kyc.types'; // ✅ Import from types

//  REMOVE THIS - Don't define enum here
// export enum KYCStatus { ... }

@Table({
  tableName: 'kyc_verifications',
  timestamps: true,
})
export class KYC extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId!: string;

  @BelongsTo(() => User)
  user!: User;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fullName!: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  dateOfBirth!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nationality!: string;

  @Column({
    type: DataType.ENUM(...Object.values(DocumentType)),
    allowNull: false,
  })
  documentType!: DocumentType;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  documentNumber!: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  address!: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  documentFront?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  documentBack?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  selfieImage?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  addressProof?: string;

  @Column({
    type: DataType.ENUM(...Object.values(KYCStatus)),
    allowNull: false,
    defaultValue: KYCStatus.NOT_STARTED,
  })
  status!: KYCStatus;

  @Column({
    type: DataType.ENUM(...Object.values(VerificationLevel)),
    allowNull: true,
  })
  verificationLevel?: VerificationLevel;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  rejectionReason?: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  reviewedBy?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  reviewedAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  submittedAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  approvedAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  expiresAt?: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
export { KYCStatus };

