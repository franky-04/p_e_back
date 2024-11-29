// src/modules/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      select: ['id', 'name', 'email', 'createdAt'] // Escludiamo la password
    });
  }

  async findOne(id: number): Promise<User | undefined> {
    return await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'createdAt'] // Escludiamo la password
    });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({
      where: { email }
      // Non escludiamo la password qui perché serve per l'autenticazione
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}