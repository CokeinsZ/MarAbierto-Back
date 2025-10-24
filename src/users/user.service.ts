import {
  ConflictException,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import {
  ChangePasswordDto,
  CreateUserDto,
  LoginDto,
  UpdateUserDto,
  UpdateUserRoleDto,
  UpdateUserStatusDto,
  VerifyEmailDto,
} from './dtos/user.dto';
import {
  User,
  user_status,
  UserServiceInterface,
} from './interfaces/user.interface';
import { UsersRepository } from '../databases/repositories/users/users.repository';
import { SecurityCodesRepository } from '../databases/repositories/users/security_codes.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mails/mail.service';

@Injectable()
export class UsersService implements UserServiceInterface {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly securityCodesRepository: SecurityCodesRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const exists = await this.userRepository.findByEmail(createUserDto.email);
    if (exists) throw new ConflictException('Email already exists');

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const savedUser = await this.userRepository.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
    if (!savedUser) throw new BadRequestException('User creation failed');

    const code = Math.floor(1000 + Math.random() * 9000).toString(); // 4 dígitos
    await this.securityCodesRepository.create(savedUser.user_id, code, 15);
    await this.mailService.sendVerificationEmail(
      savedUser.email,
      savedUser.name,
      code,
    );
    return this.toUserInterface(savedUser);
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.findAll();
    return users.map((u) => this.toUserInterface(u));
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return this.toUserInterface(user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    return this.toUserInterface(user);
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const updated = await this.userRepository.updateUser(id, dto);
    if (!updated) throw new NotFoundException('User not found');
    return this.toUserInterface(updated);
  }

  async changePassword(id: number, dto: ChangePasswordDto): Promise<void> {
    const code = await this.securityCodesRepository.find(id);
    if (!code)
      throw new NotFoundException(
        'Verification code not found, please request a new one',
      );
    if (code.code !== dto.code)
      throw new UnauthorizedException('Invalid verification code');
    if (new Date() > code.expires_at)
      throw new UnauthorizedException('Verification code expired');

    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    if (user.status !== user_status.ACTIVE)
      throw new UnauthorizedException('User is not active');

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepository.updateUserPassword(id, hashed);

    await this.securityCodesRepository.erase(id);
  }

  async updateStatus(
    id: number,
    statusDto: UpdateUserStatusDto,
  ): Promise<User> {
    const user = await this.userRepository.updateUserStatus(
      id,
      statusDto.status,
    );
    if (!user) throw new NotFoundException('User not found');
    return this.toUserInterface(user);
  }

  async updateRole(id: number, roleDto: UpdateUserRoleDto): Promise<User> {
    const user = await this.userRepository.updateUserRole(id, roleDto.role);
    if (!user) throw new NotFoundException('User not found');
    return this.toUserInterface(user);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.deleteUser(id);
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<{ message: string }> {
    const code = await this.securityCodesRepository.find(dto.id);
    if (!code) throw new NotFoundException('Verification code not found');
    if (code.code !== dto.code)
      throw new UnauthorizedException('Invalid verification code');
    if (new Date() > code.expires_at)
      throw new UnauthorizedException('Verification code expired');

    await this.userRepository.updateUserStatus(dto.id, user_status.ACTIVE);
    await this.securityCodesRepository.erase(dto.id);

    return { message: 'Email verified successfully' };
  }

  async resendVerificationCode(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    await this.securityCodesRepository.update(user.user_id, code, 15);

    await this.mailService.sendVerificationEmail(user.email, user.name, code);
    return { message: 'Verification code resent successfully' };
  }

  async login(loginDto: LoginDto): Promise<{
    message: string;
    userId: string;
    email: string;
    role: string;
    token: string;
  }> {
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) throw new NotFoundException('User not found');
    if (user.status !== user_status.ACTIVE) {
      if (user.status === user_status.NOT_VERIFIED)
        throw new UnauthorizedException('Please verify your email');
      if (user.status === user_status.BANNED)
        throw new UnauthorizedException('User is banned');
      throw new UnauthorizedException('User is not active');
    }

    const valid = await bcrypt.compare(loginDto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.user_id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION'),
    });
    return {
      message: 'Login successful',
      userId: user.user_id.toString(),
      email: user.email,
      role: user.role,
      token,
    };
  }

  private toUserInterface(user: any): User {
    return {
      user_id: user.user_id,
      name: user.name,
      last_name: user.last_name,
      national_id: user.national_id,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      status: user.status,
    };
  }
}
