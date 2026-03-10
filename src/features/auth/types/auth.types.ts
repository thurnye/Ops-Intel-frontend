/* ── Enums ────────────────────────────────────────── */

export enum UserRole {
  SuperAdmin = 1,
  Admin = 2,
  Planner = 3,
  ProductionManager = 4,
  WarehouseManager = 5,
  Operator = 6,
  Viewer = 7
}

/* ── Request types ───────────────────────────────── */

export type LoginRequest = {
  emailOrUserName: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  userName?: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  birthdate?: string;
  gender?: string;
  phoneNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateOrProvince?: string;
  country?: string;
  postalCode?: string;
  avatarFileId?: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type VerifyEmailRequest = {
  token: string;
};

/* ── Response types ──────────────────────────────── */

export type UserProfile = {
  firstName: string;
  lastName: string;
  displayName?: string;
  birthdate?: string;
  gender?: string;
  phoneNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateOrProvince?: string;
  country?: string;
  postalCode?: string;
  avatarFileId?: string;
  avatarUrl?: string;
};

export type User = {
  id: string;
  email: string;
  userName?: string;
  emailConfirmed: boolean;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  isActive: boolean;
  isLocked: boolean;
  lastLoginAtUtc?: string;
  profile: UserProfile;
  roles: string[];
  permissions: string[];
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAtUtc: string;
  user: User;
};

export type Session = {
  id: string;
  ipAddress?: string;
  userAgent?: string;
  deviceName?: string;
  browser?: string;
  operatingSystem?: string;
  createdAtUtc: string;
  lastSeenAtUtc: string;
  revokedAtUtc?: string;
  isActive: boolean;
};
