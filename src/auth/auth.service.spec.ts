import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { Role } from 'src/enums/roles.enum';
import { JwtService } from '@nestjs/jwt';

jest.mock('src/utils/bcrypt.utils.ts', () => {
  return {
    comparePasswords: jest
      .fn()
      .mockImplementation((password) => password === 'password'),
  };
});

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn().mockImplementation((email) => {
              if (email === 'test@test.com') {
                return Promise.resolve({
                  _id: '507f1f77bcf86cd799439011',
                  email: 'test@test.com',
                  name: 'Test User',
                  password: 'password',
                  roles: [Role.GUEST, Role.USER, Role.ADMIN],
                });
              } else return Promise.resolve(null);
            }),
            createOne: jest.fn().mockImplementation(() => {
              return Promise.resolve({
                _id: '507f1f77bcf86cd799439011',
                email: 'test@test.com',
                name: 'Test User',
                password: 'password',
                roles: [Role.GUEST],
              });
            }),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockImplementation(() => 'token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate a user', async () => {
    const user = await service.validateUser({
      email: 'test@test.com',
      password: 'password',
    });
    expect(user).toEqual({
      user: {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@test.com',
        name: 'Test User',
        roles: [Role.GUEST, Role.USER, Role.ADMIN],
      },
      token: 'token',
    });
  });
  it('should not validate a user', async () => {
    const user = await service.validateUser({
      email: 'aaa@test.com',
      password: 'password',
    });
    expect(user).toBeNull();

    const user2 = await service.validateUser({
      email: 'test@test.com',
      password: 'another',
    });

    expect(user2).toBeNull();
  });

  it('should signup a user', async () => {
    const user = await service.signupUser({
      name: 'test',
      email: 'test@test.com',
      password: 'another',
    });
    expect(user._id).toEqual('507f1f77bcf86cd799439011');
  });

  it('should signup a user', async () => {
    const user = await service.signupGuest({
      name: 'test',
      email: 'test@test.com',
      password: 'another',
    });
    expect(user._id).toEqual('507f1f77bcf86cd799439011');
  });
});
