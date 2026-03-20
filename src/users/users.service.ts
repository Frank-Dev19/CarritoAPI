import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, UserResponseDto } from './dto';
import { DEFAULT_USER_ID } from '../common/constants';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async onModuleInit(): Promise<void> {
    await this.seedDefaultUser();
  }

  private async seedDefaultUser(): Promise<void> {
    const userCount = await this.userRepository.count();
    if (userCount === 0) {
      const defaultUser = this.userRepository.create({
        idUsuario: DEFAULT_USER_ID,
        nombre: 'Pedro Gomez',
      });
      await this.userRepository.save(defaultUser);
      console.log('Usuario por Defecto creado exitosamente');
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      order: { idUsuario: 'ASC' },
    });
    return users;
  }

  async findOne(idUsuario: number): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findOne({
      where: { idUsuario },
    });
    return user;
  }

  async findByIdOrThrow(idUsuario: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { idUsuario },
    });
    if (!user) {
      throw new Error(`Usuario con id ${idUsuario} no encontrado`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);
    return savedUser;
  }
}
