import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export enum UserRole {
  CREATOR = 'CREATOR',
  EVENTEE = 'EVENTEE',
}

export class RegisterDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}