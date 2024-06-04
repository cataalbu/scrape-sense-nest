import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { Role } from 'src/enums/roles.enum';
import { BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let mockUserModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: Model,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    mockUserModel = module.get<Model<User>>(getModelToken(User.name));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find a user by id', async () => {
    const user = {
      _id: '507f1f77bcf86cd799439011',
      name: 'Test User',
      email: 'test@test.com',
    };
    jest.spyOn(mockUserModel, 'findById').mockResolvedValue(user);
    const result = await service.findOneById('507f1f77bcf86cd799439011');
    expect(result).toBe(user);
  });

  it('should find a user by email', async () => {
    const user = {
      _id: '507f1f77bcf86cd799439011',
      name: 'Test User',
      email: 'test@test.com',
    };
    jest
      .spyOn(mockUserModel, 'findOne')
      .mockResolvedValue({ toObject: () => user });
    const result = await service.findOneByEmail('tes@test.com');
    expect(result).toBe(user);

    jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(null);
    const result2 = await service.findOneByEmail('test@test.com');
    expect(result2).toBe(null);
  });

  it('should delete a user', async () => {
    const user = {
      _id: '507f1f77bcf86cd799439011',
      name: 'Test User',
      email: 'test@test.com',
      roles: [Role.GUEST],
    };
    jest.spyOn(mockUserModel, 'findByIdAndDelete').mockResolvedValue(user);
    const result = await service.deleteOne('507f1f77bcf86cd799439011');
    expect(result).toBe(user);
  });

  it('should update a user', async () => {
    const user = {
      _id: '507f1f77bcf86cd799439011',
      name: 'Test User',
      email: 'test@test.com',
      roles: [Role.GUEST],
    };
    jest.spyOn(mockUserModel, 'findByIdAndUpdate').mockResolvedValue(user);
    const result = await service.updateOne({
      id: '507f1f77bcf86cd799439011',
      name: 'Test User',
      email: 'test@test.com',
      roles: [Role.GUEST],
    });
    expect(result).toBe(user);
  });

  it('should make a user admin', async () => {
    const user = {
      _id: '507f1f77bcf86cd799439011',
      name: 'Test User',
      email: 'test@test.com',
      roles: [Role.ADMIN, Role.USER, Role.GUEST],
    };
    jest.spyOn(mockUserModel, 'findByIdAndUpdate').mockResolvedValue(user);
    const result = await service.makeUserAdmin('507f1f77bcf86cd799439011');
    expect(result.roles.includes(Role.ADMIN)).toBe(true);
  });

  it('should make a user guest', async () => {
    const user = {
      _id: '507f1f77bcf86cd799439011',
      name: 'Test User',
      email: 'test@test.com',
      roles: [Role.USER, Role.GUEST],
    };

    jest.spyOn(mockUserModel, 'findByIdAndUpdate').mockResolvedValue(user);
    const result = await service.makeGuestUser('507f1f77bcf86cd799439011');
    expect(result.roles.includes(Role.USER)).toBe(true);
  });

  it('should create a user', async () => {
    const user = {
      _id: '507f1f77bcf86cd799439011',
      name: 'Test User',
      email: 'test@test.com',
      roles: [Role.USER, Role.GUEST],
    };
    service.findOneByEmail = jest.fn().mockResolvedValue(null);
    jest.spyOn(mockUserModel, 'create').mockResolvedValue(user as any);
    const result = await service.createOne({
      name: 'Test User',
      email: 'test@test.com',
      password: 'password',
    });
    expect(result).toBe(user);

    service.findOneByEmail = jest.fn().mockResolvedValue(user);
    await expect(
      service.createOne({
        name: 'Test User',
        email: 'test@test.com',
        password: 'password',
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
