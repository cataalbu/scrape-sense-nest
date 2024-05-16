import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getModelToken } from '@nestjs/mongoose';
import { Product } from 'src/schemas/product.schema';
import { WebsitesService } from 'src/websites/websites.service';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockProductModel: Model<Product>;
  let mockWebsitesService: WebsitesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: Model,
        },
        {
          provide: WebsitesService,
          useValue: {
            findOneByUrl: jest
              .fn()
              .mockResolvedValue({ id: '507f1f77bcf86cd799439011' }),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    mockProductModel = module.get<Model<Product>>(getModelToken(Product.name));
    mockWebsitesService = module.get<WebsitesService>(WebsitesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all products', async () => {
    jest.spyOn(mockProductModel, 'find').mockReturnValueOnce({
      populate: () => [
        {
          _id: '507f1f77bcf86cd799439011',
          name: 'Test Website 1',
          url: 'https://test-website1.com',
          type: 'csr',
        },
        {
          _id: '507f1f77bcf86cd799439012',
          name: 'Test Website 2',
          url: 'https://test-website2.com',
          type: 'ssr',
        },
      ],
    } as any);

    const products = await service.findAll();
    expect(products.length).toEqual(2);
  });

  it('should return all products paginated', async () => {
    jest.spyOn(mockProductModel, 'countDocuments').mockReturnValueOnce({
      exec: () => Promise.resolve(2),
    } as any);

    jest.spyOn(mockProductModel, 'find').mockReturnValueOnce({
      skip: () => ({
        limit: () => ({
          populate: () =>
            Promise.resolve([
              {
                _id: '507f1f77bcf86cd799439011',
                name: 'Test Website 1',
                url: 'https://test-website1.com',
                type: 'csr',
              },
              {
                _id: '507f1f77bcf86cd799439012',
                name: 'Test Website 2',
                url: 'https://test-website2.com',
                type: 'ssr',
              },
            ]),
        }),
      }),
    } as any);

    const result = await service.findAllPaginated();
    expect(result.data.length).toBe(2);
    expect(result.count).toBe(2);
    expect(result.pageTotal).toBe(1);
  });

  it('should return one product by id', async () => {
    jest.spyOn(mockProductModel, 'findById').mockReturnValueOnce({
      populate: () => ({
        _id: '507f1f77bcf86cd799439011',
        name: 'Test Website 1',
        imageURL: 'https://test-website1.com',
        prices: [{ price: 100, date: new Date() }],
        rating: 5,
        websiteId: '507f1f77bcf86cd799439011',
        website: {
          _id: '507f1f77bcf86cd799439011',
          name: 'Test Website 1',
          url: 'https://test-website1.com',
          type: 'csr',
        },
      }),
    } as any);

    const product = await service.findOneById('507f1f77bcf86cd799439011');
    expect(product.name).toBe('Test Website 1');
    expect(product.imageURL).toBe('https://test-website1.com');
  });

  it('should throw an error when the id is invalid', async () => {
    try {
      await service.findOneById('invalid-id');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });

  it('should create a new product', async () => {
    const product = {
      name: 'Test Product',
      imageURL: 'https://test-product.com',
      prices: [{ price: 100, date: new Date() }],
      rating: 5,
      websiteId: '507f1f77bcf86cd799439011',
    };

    jest.spyOn(mockProductModel, 'create').mockResolvedValue(product as any);

    const result = await service.createOne(product as any);
    expect(result.name).toBe('Test Product');
    expect(result.imageURL).toBe('https://test-product.com');
  });

  it('should update a product', async () => {
    const product = {
      id: '507f1f77bcf86cd799439011',
      name: 'Test Product',
      imageURL: 'https://test-product.com',
      prices: [{ price: 100, date: new Date() }],
      rating: 5,
      websiteId: '507f1f77bcf86cd799439011',
    };

    jest
      .spyOn(mockProductModel, 'findByIdAndUpdate')
      .mockReturnValueOnce(product as any);

    const result = await service.updateOne(product as any);
    expect(result.name).toBe('Test Product');
    expect(result.imageURL).toBe('https://test-product.com');
  });

  it('should delete a product', async () => {
    jest.spyOn(mockProductModel, 'findByIdAndDelete').mockResolvedValue({
      _id: '507f1f77bcf86cd799439011',
      name: 'Test Product',
      imageURL: 'https://test-product.com',
      prices: [{ price: 100, date: new Date() }],
      rating: 5,
      websiteId: '507f1f77bcf86cd799439011',
    } as any);

    const result = await service.deleteOne('507f1f77bcf86cd799439011');
    expect(result.name).toBe('Test Product');
    expect(result.imageURL).toBe('https://test-product.com');
  });

  it('should update or create a product with product info', async () => {
    const productInfo = {
      name: 'Test Product',
      imageURL: 'https://test-product.com',
      price: 100,
      rating: 5,
      websiteId: '507f1f77bcf86cd799439011',
      websiteURL: 'https://test-website1.com',
      date: new Date(),
    };

    jest
      .spyOn(mockProductModel, 'findOneAndUpdate')
      .mockReturnValueOnce(productInfo as any);

    const result = await service.updateOrCreateWithProductInfo(
      productInfo as any,
    );
    expect(result.name).toBe('Test Product');
    expect(result.imageURL).toBe('https://test-product.com');
  });

  it('should update products with scraped products', async () => {
    const products = [
      {
        name: 'Test Product 1',
        imageURL: 'https://test-product1.com',
        price: 100,
        rating: 5,
        websiteId: '507f1f77bcf86cd799439011',
        websiteURL: 'https://test-website1.com',
        date: new Date(),
      },
      {
        name: 'Test Product 2',
        imageURL: 'https://test-product2.com',
        price: 200,
        rating: 4,
        websiteId: '507f1f77bcf86cd799439012',
        websiteURL: 'https://test-website2.com',
        date: new Date(),
      },
    ];

    jest.spyOn(service, 'updateOrCreateWithProductInfo').mockResolvedValue({
      name: 'Test Product 1',
      imageURL: 'https://test-product1.com',
      price: 100,
      rating: 5,
      websiteId: '507f1f77bcf86cd799439011',
    } as any);

    const result = await service.updateProductsWithScrapedProducts(products);
    expect(result.length).toBe(2);
  });
});
