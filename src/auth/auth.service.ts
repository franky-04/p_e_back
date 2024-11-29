// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    console.log('Login user:', user);
    const payload = {
      email: user.email,
      sub: Number(user.id),
    };
    console.log('Login payload:', payload);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    // Verifica se l'utente esiste già
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    // Hash della password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Crea nuovo utente
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // Rimuovi la password dal risultato
    const { password: _, ...result } = user;
    return result;
  }
}