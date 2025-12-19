import { Provider } from '@nestjs/common';
import { STUDENT_STATE_REPOSITORY } from '../constants/repository.tokens';
import { JsonStudentStateRepository } from '../repositories/json-student-state.repository';

export const jsonStudentStateProvider: Provider = {
  provide: STUDENT_STATE_REPOSITORY,
  useClass: JsonStudentStateRepository,
};
