// src/lib/types.ts
/**
 * Shared TypeScript enums mirroring Prisma enums for front‑end usage.
 */
export enum Role {
  GUEST = 'GUEST',
  HOST = 'HOST',
  TRANSPORT_OPERATOR = 'TRANSPORT_OPERATOR',
  GUIDE = 'GUIDE',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export enum TransactionStatus {
  INITIATED = 'INITIATED',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}
