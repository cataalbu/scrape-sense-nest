import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-headerapikey';
import { AuthService } from '../auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'headerapikey') {
  constructor(private authService: AuthService) {
    super(
      {
        header: 'x-api-key',
        prefix: '',
      },
      true,
      async (apiKey, done) => {
        return this.validate(apiKey, done);
      },
    );
  }

  validate = async (apiKey: string, done: (error: Error, data) => {}) => {
    // const key = await this.authService.validateApiKey(apiKey);
    // if (!key) {
    //   done(new UnauthorizedException(), null);
    // }
    done(null, true);
  };
}
