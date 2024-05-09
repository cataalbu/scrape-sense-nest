import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getModelToken } from '@nestjs/mongoose';
import { Product } from 'src/schemas/product.schema';
import { WebsitesService } from 'src/websites/websites.service';

describe('ProductsService', () => {
  let service: ProductsService;

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
            findAll: jest.fn(
              () =>
                new Promise((resolve) =>
                  resolve([
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
                ),
            ),
            findOneById: jest.fn(),
            createOne: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
            findOneByUrl: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
