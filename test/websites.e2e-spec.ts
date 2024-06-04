require('leaked-handles');
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { cleanUpSqsMock, setupSqsMock } from './mockSqs';
import { hashPassword } from 'src/utils/bcrypt.utils';
import { User } from 'src/schemas/user.schema';
import { Connection, Model, connection } from 'mongoose';
import { Role } from 'src/enums/roles.enum';
import {
  MongooseModule,
  getConnectionToken,
  getModelToken,
} from '@nestjs/mongoose';
import { WebsiteType } from 'src/enums/website-types.enum';
import { count } from 'console';

describe('WebsitesController (e2e)', () => {
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

  describe('unauthenticated', () => {
    it('/ (GET)', async () => {
      const res = await request(app.getHttpServer()).get('/websites');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized');
    });

    it('/ (GET:id)', async () => {
      const res = await request(app.getHttpServer()).get('/websites/1');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized');
    });

    it('/ (POST)', async () => {
      const res = await request(app.getHttpServer()).post('/websites');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized');
    });

    it('/ (PATCH)', async () => {
      const res = await request(app.getHttpServer()).patch('/websites');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized');
    });

    it('/ (DELETE)', async () => {
      const res = await request(app.getHttpServer()).delete('/websites/1');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized');
    });
  });

  describe('unauthorized', () => {
    let userToken: string;

    beforeAll(async () => {
      const user = await request(app.getHttpServer()).post('/auth/login').send({
        email: 'guest@test.com',
        password: 'password',
      });
      userToken = user.body.token;
    });
    it('/ (POST)', async () => {
      const res = await request(app.getHttpServer())
        .post('/websites')
        .set({ Authorization: `Bearer ${userToken}` })
        .send({
          name: 'test',
          url: 'http://test.com',
          type: WebsiteType.CSR,
        });
      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Forbidden resource');
    });
  });

  describe('authorized', () => {
    let userToken: string;
    let createWebsiteId: string;

    beforeAll(async () => {
      const user = await request(app.getHttpServer()).post('/auth/login').send({
        email: 'test@test.com',
        password: 'password',
      });
      userToken = user.body.token;
    });

    it('/ (GET)', async () => {
      const res = await request(app.getHttpServer())
        .get('/websites')
        .set({
          Authorization: `Bearer ${userToken}`,
        });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        data: [],
        count: 0,
        pageTotal: 1,
      });
    });

    it('/ (POST)', async () => {
      const res = await request(app.getHttpServer())
        .post('/websites')
        .set({ Authorization: `Bearer ${userToken}` })
        .send({
          name: 'test',
          url: 'http://test.com',
          type: WebsiteType.CSR,
        });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.name).toBe('test');
      expect(res.body.url).toBe('http://test.com');
      expect(res.body.type).toBe(WebsiteType.CSR);

      createWebsiteId = res.body.id;
    });

    it('/ (GET:id)', async () => {
      const res = await request(app.getHttpServer())
        .get(`/websites/${createWebsiteId}`)
        .set({
          Authorization: `Bearer ${userToken}`,
        });

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(createWebsiteId);
      expect(res.body.name).toBe('test');
      expect(res.body.url).toBe('http://test.com');
      expect(res.body.type).toBe(WebsiteType.CSR);
    });

    it('/ (PATCH)', async () => {
      const res = await request(app.getHttpServer())
        .patch('/websites')
        .set({ Authorization: `Bearer ${userToken}` })
        .send({
          id: createWebsiteId,
          name: 'test',
          url: 'http://test.com',
          type: WebsiteType.SSR,
        });

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(createWebsiteId);
      expect(res.body.name).toBe('test');
      expect(res.body.url).toBe('http://test.com');
      expect(res.body.type).toBe(WebsiteType.SSR);
    });

    it('/ (DELETE)', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/websites/${createWebsiteId}`)
        .set({
          Authorization: `Bearer ${userToken}`,
        });

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(createWebsiteId);
      expect(res.body.name).toBe('test');
      expect(res.body.url).toBe('http://test.com');
      expect(res.body.type).toBe(WebsiteType.SSR);
    });
  });
});
