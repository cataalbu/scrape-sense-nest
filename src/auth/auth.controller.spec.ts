import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Role } from 'src/enums/roles.enum';
import { Request } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signupUser: jest.fn().mockImplementation(() =>
              Promise.resolve({
                _id: '507f1f77bcf86cd799439011',
                email: 'test@test.com',
                password: 'password',
                name: 'Test User',
                roles: [Role.GUEST, Role.USER, Role.ADMIN],
              }),
            ),
            validateUser: jest
              .fn()
              .mockImplementation(({ email, passworkd }) =>
                email === 'test@test.com'
                  ? Promise.resolve({
                      user: {
                        _id: '507f1f77bcf86cd799439011',
                        email: 'test@test.com',
                        name: 'Test User',
                        roles: [Role.GUEST, Role.USER],
                      },
                      token: 'token',
                    })
                  : Promise.resolve({
                      user: {
                        _id: '507f1f77bcf86cd799439012',
                        email: 'guest@test.com',
                        name: 'guest User',
                        roles: [Role.GUEST],
                      },
                      token: 'token',
                    }),
              ),
            signupGuest: jest.fn().mockImplementation(({ email, passworkd }) =>
              Promise.resolve({
                user: {
                  _id: '507f1f77bcf86cd799439012',
                  email: 'guest@test.com',
                  name: 'guest User',
                  roles: [Role.GUEST],
                },
                token: 'token',
              }),
            ),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should signup a user', async () => {
    const user = await controller.signup({
      email: 'test@test.com',
      password: 'password',
      name: 'Test User',
    });
    expect(user).toEqual({
      user: {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@test.com',
        name: 'Test User',
        roles: [Role.GUEST, Role.USER],
      },
      token: 'token',
    });
  });

  it('should signup a guest', async () => {
    const user = await controller.signupGuest({
      email: 'guest@test.com',
      password: 'password',
      name: 'guest User',
    });
    expect(user).toEqual({
      user: {
        _id: '507f1f77bcf86cd799439012',
        email: 'guest@test.com',
        name: 'guest User',
        roles: [Role.GUEST],
      },
      token: 'token',
    });
  });

  it('should login a user', async () => {
    const request = {
      user: {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@test.com',
        name: 'Test User',
        roles: [Role.GUEST, Role.USER],
      },
    } as unknown as Request;
    const user = await controller.login(request);
    expect(user).toEqual({
      _id: '507f1f77bcf86cd799439011',
      email: 'test@test.com',
      name: 'Test User',
      roles: [Role.GUEST, Role.USER],
    });
  });
});
