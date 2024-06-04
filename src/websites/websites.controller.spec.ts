import { Test, TestingModule } from '@nestjs/testing';
import { WebsitesController } from './websites.controller';
import { WebsitesService } from './websites.service';
import { Model } from 'mongoose';
import { Website } from 'src/schemas/website.schema';
import { getModelToken } from '@nestjs/mongoose';
import { WebsiteType } from 'src/enums/website-types.enum';
import { NotFoundException } from '@nestjs/common';

describe('WebsitesController', () => {
  let controller: WebsitesController;
  let websiteService: WebsitesService;
  let mockWebsiteModel: Model<Website>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebsitesController],
      providers: [
        {
          provide: WebsitesService,
          useValue: {
            findAllPaginated: jest.fn().mockResolvedValue({
              data: [
                {
                  _id: '507f1f77bcf86cd799439011',
                  name: 'Test Website',
                  url: 'https://example.com',
                  type: WebsiteType.CSR,
                },
              ],
              count: 1,
              pageTotal: 1,
            }),
            findOneById: jest.fn().mockResolvedValue({
              _id: '507f1f77bcf86cd799439011',
              name: 'Test Website',
              url: 'https://example.com',
              type: WebsiteType.CSR,
            }),
            createOne: jest.fn().mockImplementation((websiteData) => ({
              _id: '507f1f77bcf86cd799439011',
              ...websiteData,
            })),
            deleteOne: jest.fn().mockImplementation((id) => {
              if (id === '507f1f77bcf86cd799439011')
                return {
                  _id: '507f1f77bcf86cd799439011',
                  name: 'Test Website',
                  url: 'https://example.com',
                  type: WebsiteType.CSR,
                };
              return null;
            }),
            updateOne: jest.fn().mockImplementation((websiteData) => {
              if (websiteData.id === '507f1f77bcf86cd799439011')
                return {
                  _id: '507f1f77bcf86cd799439011',
                  name: 'Test Website',
                  url: 'https://example.com',
                  type: WebsiteType.CSR,
                };
              return null;
            }),
          },
        },
        {
          provide: getModelToken(Website.name),
          useValue: Model,
        },
      ],
    }).compile();

    controller = module.get<WebsitesController>(WebsitesController);
    websiteService = module.get<WebsitesService>(WebsitesService);
    mockWebsiteModel = module.get<Model<Website>>(getModelToken(Website.name));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get website list', async () => {
    const res = await controller.getWebsites(0, 10);
    expect(res.data.length).toBe(1);
    expect(res.data[0].name).toBe('Test Website');
    expect(res.data[0].url).toBe('https://example.com');
    expect(res.data[0].type).toBe(WebsiteType.CSR);

    expect(res.count).toBe(1);
    expect(res.pageTotal).toBe(1);
  });

  it('should get website by id', async () => {
    const res = await controller.getWebsite('507f1f77bcf86cd799439011');
    expect(res.name).toBe('Test Website');
    expect(res.url).toBe('https://example.com');
    expect(res.type).toBe(WebsiteType.CSR);
  });

  it('should create website', async () => {
    const res = await controller.createWebsite({
      name: 'Test Website',
      url: 'https://example.com',
      type: WebsiteType.CSR,
    });

    expect(res.name).toBe('Test Website');
    expect(res.url).toBe('https://example.com');
    expect(res.type).toBe(WebsiteType.CSR);
  });

  it('should update website', async () => {
    const res = await controller.updateWebsite({
      id: '507f1f77bcf86cd799439011',
      name: 'Test Website',
      url: 'https://example.com',
      type: WebsiteType.CSR,
    });

    expect(res.name).toBe('Test Website');
    expect(res.url).toBe('https://example.com');
    expect(res.type).toBe(WebsiteType.CSR);

    await expect(
      controller.updateWebsite({
        id: '507f1f77bcf86cd799439012',
        name: 'Test Website',
        url: 'https://example.com',
        type: WebsiteType.CSR,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should delete website', async () => {
    const res = await controller.deleteWebsite('507f1f77bcf86cd799439011');
    expect(res.name).toBe('Test Website');
    expect(res.url).toBe('https://example.com');
    expect(res.type).toBe(WebsiteType.CSR);

    await expect(
      controller.deleteWebsite('507f1f77bcf86cd799439012'),
    ).rejects.toThrow(NotFoundException);
  });
});
