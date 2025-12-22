declare module '@prisma/client' {
  export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
    PROPERTY_MANAGER = 'PROPERTY_MANAGER'
  }

  export enum KycStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
  }

  export enum AssetStatus {
    DRAFT = 'DRAFT',
    PENDING_APPROVAL = 'PENDING_APPROVAL',
    ACTIVE = 'ACTIVE',
    FUNDED = 'FUNDED',
    CLOSED = 'CLOSED'
  }

  export enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED'
  }

  export enum ProposalStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
  }
}
