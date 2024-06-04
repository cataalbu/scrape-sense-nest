import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Role } from 'src/enums/roles.enum';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findOneById: jest.fn().mockImplementation((id) => {
              if (id === '507f1f77bcf86cd799439011')
                return Promise.resolve({
                  _id: '507f1f77bcf86cd799439011',
                  email: 'test@test.com',
                  name: 'Test User',
                  password: 'password',
                  roles: [Role.GUEST, Role.USER, Role.ADMIN],
                });
              else return Promise.resolve(null);
            }),
            updateOne: jest.fn().mockImplementation((user) => {
              if (user.id === '507f1f77bcf86cd799439011')
                return Promise.resolve({
                  _id: '507f1f77bcf86cd799439011',
                  email: 'test@test.com',
                  name: 'Test User',
                  password: 'password',
                  roles: [Role.GUEST, Role.USER, Role.ADMIN],
                });
              else return Promise.resolve(null);
            }),
            deleteOne: jest.fn().mockImplementation((id) => {
              if (id === '507f1f77bcf86cd799439011')
                return Promise.resolve({
                  _id: '507f1f77bcf86cd799439011',
                  email: 'test@test.com',
                  name: 'Test User',
                  password: 'password',
                  roles: [Role.GUEST, Role.USER, Role.ADMIN],
                });
              else return Promise.resolve(null);
            }),
            makeUserAdmin: jest.fn().mockResolvedValue({
              _id: '507f1f77bcf86cd799439011',
              email: 'test@test.com',
              name: 'Test User',
              password: 'password',
              roles: [Role.GUEST, Role.USER, Role.ADMIN],
            }),
            makeGuestUser: jest.fn().mockResolvedValue({
              _id: '507f1f77bcf86cd799439011',
              email: 'test@test.com',
              name: 'Test User',
              password: 'password',
              roles: [Role.GUEST, Role.USER],
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should get a user', async () => {
    const user = await controller.getUser('507f1f77bcf86cd799439011');
    expect(user).toEqual({
      _id: '507f1f77bcf86cd799439011',
      email: 'test@test.com',
      name: 'Test User',
      password: 'password',
      roles: [Role.GUEST, Role.USER, Role.ADMIN],
    });
  });
  it('should throw an error when getting a user with an invalid id', async () => {
    await expect(controller.getUser('invalid')).rejects.toThrow(
      NotFoundException,
    );
  });
  it('should throw an error when getting a user that does not exist', async () => {
    userService.findOneById = jest.fn().mockResolvedValue(null);
    await expect(
      controller.getUser('507f1f77bcf86cd799439012'),
    ).rejects.toThrow(NotFoundException);
  });
  it('should update a user', async () => {
    const user = await controller.updateUser({
      id: '507f1f77bcf86cd799439011',
      name: 'Test User',
    });
    expect(user).toEqual({
      _id: '507f1f77bcf86cd799439011',
      email: 'test@test.com',
      name: 'Test User',
      password: 'password',
      roles: [Role.GUEST, Role.USER, Role.ADMIN],
    });
  });
  it('should throw an error when updating a user with an invalid id', async () => {
    await expect(
      controller.updateUser({ id: 'invalid', name: 'Test User' }),
    ).rejects.toThrow(NotFoundException);
  });
  it('should throw an error when updating a user that does not exist', async () => {
    userService.updateOne = jest.fn().mockResolvedValue(null);
    await expect(
      controller.updateUser({
        id: '507f1f77bcf86cd799439012',
        name: 'Test User',
      }),
    ).rejects.toThrow(NotFoundException);
  });
  it('should delete a user', async () => {
    const user = await controller.deleteUser('507f1f77bcf86cd799439011');
    expect(user).toEqual({
      _id: '507f1f77bcf86cd799439011',
      email: 'test@test.com',
      name: 'Test User',
      password: 'password',
      roles: [Role.GUEST, Role.USER, Role.ADMIN],
    });
  });
  it('should throw an error when deleting a user with an invalid id', async () => {
    await expect(controller.deleteUser('invalid')).rejects.toThrow(
      NotFoundException,
    );
  });
  it('should throw an error when deleting a user that does not exist', async () => {
    await expect(
      controller.deleteUser('507f1f77bcf86cd799439012'),
    ).rejects.toThrow(NotFoundException);
  });
  it('should make a user an admin', async () => {
    const user = await controller.makeUserAdmin('507f1f77bcf86cd799439011');
    expect(user).toEqual({
      _id: '507f1f77bcf86cd799439011',
      email: 'test@test.com',
      name: 'Test User',
      password: 'password',
      roles: [Role.GUEST, Role.USER, Role.ADMIN],
    });
  });
  it('should make a user a guest user', async () => {
    const user = await controller.makeGuestUser('507f1f77bcf86cd799439011');
    expect(user).toEqual({
      _id: '507f1f77bcf86cd799439011',
      email: 'test@test.com',
      name: 'Test User',
      password: 'password',
      roles: [Role.GUEST, Role.USER],
    });
  });
});
