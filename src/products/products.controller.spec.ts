import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

const mockProduct = {
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
};

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            findAllPaginated: jest.fn().mockResolvedValue({
              data: [mockProduct],
              count: 1,
              pageTotal: 1,
            }),
            findOneById: jest.fn().mockResolvedValue(mockProduct),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProducts', () => {
    it('should return an array of products', async () => {
      const result = await controller.getProducts(0, 10, 'Test Website 1');

      expect(result.data[0]).toEqual(mockProduct);
    });
  });

  describe('getProduct', () => {
    it('should return a product', async () => {
      const result = await controller.getProduct('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockProduct);
    });
  });
});
