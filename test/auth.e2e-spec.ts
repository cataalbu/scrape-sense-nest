import { INestApplication } from '@nestjs/common';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Connection, Model } from 'mongoose';
import { AppModule } from 'src/app.module';
import { cleanUpSqsMock, setupSqsMock } from './mockSqs';
import { User } from 'src/schemas/user.schema';
import { hashPassword } from 'src/utils/bcrypt.utils';
import { Role } from 'src/enums/roles.enum';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userModel: Model<User>;
  let dbConnection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dbConnection = moduleFixture.get<Connection>(getConnectionToken());

    userModel = app.get<Model<User>>(getModelToken('User'));

    await app.init();
    setupSqsMock();

    await userModel.create({
      email: 'test@test.com',
      name: 'test',
      password: hashPassword('password'),
      roles: [Role.ADMIN, Role.USER, Role.GUEST],
    });
    await userModel.create({
      email: 'guest@test.com',
      name: 'guest',
      password: hashPassword('password'),
      roles: [Role.GUEST],
    });
  });

  afterAll(async () => {
    const collections = Object.keys(dbConnection.collections);
    for (const collection of collections) {
      await dbConnection.dropCollection(collection);
    }
    await app.close();
    cleanUpSqsMock();
  });

  it('should login a user /auth/login (POST)', async () => {
    const res = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'test@test.com',
      password: 'password',
    });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe('test@test.com');
    expect(res.body.user.roles).toEqual([Role.ADMIN, Role.USER, Role.GUEST]);
    expect(res.body.user.password).toBeUndefined();
    expect(res.body.user.id).toBeDefined();
    expect(res.body.user.name).toBe('test');
  });

  it('should signup a user /auth/signup (POST)', async () => {
    const res = await request(app.getHttpServer()).post('/auth/signup').send({
      email: 'new@test.com',
      password: 'password',
      name: 'new',
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe('new@test.com');
    expect(res.body.user.roles).toEqual([Role.USER, Role.GUEST]);
    expect(res.body.user.password).toBeUndefined();
    expect(res.body.user.id).toBeDefined();
    expect(res.body.user.name).toBe('new');
  });

  it('should signup a guest /auth/signup/guest (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup/guest')
      .send({
        email: 'newguest@test.com',
        password: 'password',
        name: 'newguest',
      });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe('newguest@test.com');
    expect(res.body.user.roles).toEqual([Role.GUEST]);
    expect(res.body.user.password).toBeUndefined();
    expect(res.body.user.id).toBeDefined();
    expect(res.body.user.name).toBe('newguest');
  });
});
