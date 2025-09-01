import {
  ChangePasswordDto,
  CreateUserDto,
  LoginDto,
  UpdateUserDto,
  UpdateUserRoleDto,
  UpdateUserStatusDto,
  VerifyEmailDto,
} from '../dtos/user.dto';

export enum user_status {
  NOT_VERIFIED = 'not_verified',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

export enum user_role {
  ADMIN = 'admin',
  USER = 'user'
}

export interface User {
  user_id: number;
  name: string;
  last_name: string;
  national_id: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
  status: user_status;
  role: user_role;
}

export interface UserServiceInterface {
  create(createUserDto: CreateUserDto): Promise<User>;
  findAll(): Promise<User[]>;
  findOne(id: number): Promise<User>;
  findByEmail(email: string): Promise<User>;
  update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
  remove(id: number): Promise<void>;
  verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<{ message: string }>;

  login(
    loginDto: LoginDto,
  ): Promise<{ message: string, userId: string }>;

  changePassword(
    id: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void>;

  updateStatus(
    id: number,
    status: UpdateUserStatusDto,
  ): Promise<User>;

  updateRole(
    id: number,
    role: UpdateUserRoleDto,
  ): Promise<User>;
}
