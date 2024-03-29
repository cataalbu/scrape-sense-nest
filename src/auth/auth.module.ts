import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ApiKeysModule } from 'src/api-keys/api-keys.module';
import { ApiKeyStrategy } from './strategies/api-key.strategy';
import { ApiKeyAuthGuard } from 'src/guards/api-key-auth.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService) => ({
        secret: configService.get('APP_JWT_SECRET'),
        signOptions: {
          expiresIn: '1w',
        },
      }),
      inject: [ConfigService],
    }),
    ApiKeysModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, ApiKeyStrategy],
})
export class AuthModule {}
