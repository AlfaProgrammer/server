import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async(config: ConfigService)=>({uri: config.get("DATABASE_URL")}),
    }),
    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
