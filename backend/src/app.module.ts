import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RetencionModule } from './retencion/retencion.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    RetencionModule,
  ],
})
export class AppModule {}
