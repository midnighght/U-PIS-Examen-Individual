import { Module } from '@nestjs/common';
import { JsonStudentStatusRepository } from './repositories/json-student-status.repository';

@Module({
  providers: [JsonStudentStatusRepository],
  exports: [JsonStudentStatusRepository],
})
export class DatabaseModule {}
