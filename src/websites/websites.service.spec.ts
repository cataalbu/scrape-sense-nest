import { Test, TestingModule } from '@nestjs/testing';
import { WebsitesService } from './websites.service';
import { getModelToken } from '@nestjs/mongoose';
import { Website } from 'src/schemas/website.schema';
import { Model } from 'mongoose';
import { WebsiteType } from 'src/enums/website-types.enum';
import { NotFoundException } from '@nestjs/common';

const testFindAllPaginatedSpyHelper = (mockWebsiteModel: Model<Website>) => {
  jest.clearAllMocks();
  jest
    .spyOn(mockWebsiteModel, 'countDocuments')
    .mockReturnValueOnce({ exec: () => Promise.resolve(10) } as any);
  jest.spyOn(mockWebsiteModel, 'find').mockReturnValueOnce({
    skip: (value) => ({
      limit: (value) =>
        Promise.resolve([
          {
            _id: '507f1f77bcf86cd799439011',
            name: 'Test Website',
            url: 'https://example.com',
            type: WebsiteType.CSR,
          },
        ]),
    }),
  } as any);
};

describe('WebsitesService', () => {
  let service: WebsitesService;
  let mockWebsiteModel: Model<Website>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebsitesService,
        {
          provide: getModelToken(Website.name),
          useValue: Model,
        },
      ],
    }).compile();

    service = module.get<WebsitesService>(WebsitesService);
    mockWebsiteModel = module.get<Model<Website>>(getModelToken(Website.name));
  });

  it('should return all websites paginated', async () => {
    testFindAllPaginatedSpyHelper(mockWebsiteModel);
    let result = await service.findAllPaginated(0, 10);
    expect(result.data.length).toBe(1);
    expect(result.data[0].name).toBe('Test Website');
    expect(result.data[0].url).toBe('https://example.com');
    expect(result.data[0].type).toBe(WebsiteType.CSR);
    expect(result.count).toBe(10);
    expect(result.pageTotal).toBe(1);

    testFindAllPaginatedSpyHelper(mockWebsiteModel);
    result = await service.findAllPaginated();
    expect(result.count).toBe(10);
    expect(result.pageTotal).toBe(1);

    testFindAllPaginatedSpyHelper(mockWebsiteModel);
    result = await service.findAllPaginated(0, 5);
    expect(result.count).toBe(10);
    expect(result.pageTotal).toBe(2);

    testFindAllPaginatedSpyHelper(mockWebsiteModel);
    result = await service.findAllPaginated(0, 20);
    expect(result.count).toBe(10);
    expect(result.pageTotal).toBe(1);
  });

  it('should create a new website', async () => {
    const website = new Website();
    website.name = 'Test Website';
    website.url = 'https://example.com';
    website.type = WebsiteType.CSR;

    jest.spyOn(mockWebsiteModel, 'create').mockResolvedValue(website as any);
    const result = await service.createOne({
      name: 'Test Website',
      url: 'https://example.com',
      type: WebsiteType.CSR,
    });

    expect(result.name).toBe('Test Website');
    expect(result.url).toBe('https://example.com');
    expect(result.type).toBe(WebsiteType.CSR);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all websites', async () => {
    jest.spyOn(mockWebsiteModel, 'find').mockResolvedValue([
      {
        _id: '507f1f77bcf86cd799439011',
        name: 'Test Website',
        url: 'https://example.com',
        type: WebsiteType.CSR,
      },
    ]);
    const result = await service.findAll();
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Test Website');
    expect(result[0].url).toBe('https://example.com');
    expect(result[0].type).toBe(WebsiteType.CSR);
  });

  it('should return a website by ID', async () => {
    const websiteId = '507f1f77bcf86cd799439011';
    jest.spyOn(mockWebsiteModel, 'findById').mockResolvedValue({
      _id: '507f1f77bcf86cd799439011',
      name: 'Test Website',
      url: 'https://example.com',
      type: WebsiteType.CSR,
    });
    const result = await service.findOneById(websiteId);
    expect(result.name).toBe('Test Website');
    expect(result.url).toBe('https://example.com');
    expect(result.type).toBe(WebsiteType.CSR);
  });

  it('should throw not found exception if website id is not valid ObjectId', async () => {
    const websiteId = 'invalid-id';
    await expect(service.findOneById(websiteId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw not found exception if website does not exist', async () => {
    const websiteId = '507f1f77bcf86cd799439011';
    jest.spyOn(mockWebsiteModel, 'findById').mockResolvedValue(null);
    await expect(service.findOneById(websiteId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return a website by url', async () => {
    jest.spyOn(mockWebsiteModel, 'findOne').mockResolvedValue({
      _id: '507f1f77bcf86cd799439011',
      name: 'Test Website',
      url: 'https://example.com',
      type: WebsiteType.CSR,
    });
    const result = await service.findOneByUrl('https://example.com');
    expect(result.name).toBe('Test Website');
    expect(result.url).toBe('https://example.com');
    expect(result.type).toBe(WebsiteType.CSR);
  });

  it('should delete one by id', async () => {
    jest.spyOn(mockWebsiteModel, 'findByIdAndDelete').mockResolvedValue({
      _id: '507f1f77bcf86cd799439011',
      name: 'Test Website',
      url: 'https://example.com',
      type: WebsiteType.CSR,
    });
    const result = await service.deleteOne('507f1f77bcf86cd799439011');
    expect(result.name).toBe('Test Website');
  });

  it('should update one', async () => {
    jest.spyOn(mockWebsiteModel, 'findByIdAndUpdate').mockResolvedValue({
      _id: '507f1f77bcf86cd799439011',
      name: 'Test Website',
      url: 'https://example.com',
      type: WebsiteType.CSR,
    });
    const result = await service.updateOne({
      id: '507f1f77bcf86cd799439011',
      name: 'Test Website',
      url: 'https://example.com',
      type: WebsiteType.CSR,
    });
    expect(result.name).toBe('Test Website');
  });
});
