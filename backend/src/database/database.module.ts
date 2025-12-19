import { Module } from '@nestjs/common';
import { JsonStudentStateRepository } from './repositories/json-student-state.repository';

@Module({
  providers: [JsonStudentStateRepository],
  exports: [JsonStudentStateRepository],
})
export class DatabaseModule {}
