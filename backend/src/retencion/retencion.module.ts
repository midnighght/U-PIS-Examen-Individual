import { Module } from '@nestjs/common';
import { RetencionController } from './retencion.controller';
import { RetencionService } from './retencion.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RetencionController],
  providers: [RetencionService],
  exports: [RetencionService],
})
export class RetencionModule {}
