import { Injectable } from '@nestjs/common';
import { StudentState } from './interfaces/student-state.repository';
import { JsonStudentStateRepository } from '../database/repositories/json-student-state.repository';

@Injectable()
export class RetencionService {
  constructor(
    private readonly studentStateRepository: JsonStudentStateRepository,
  ) {}

  async findAll(): Promise<StudentState[]> {
    return this.studentStateRepository.findAll();
  }

  async findById(id: string): Promise<StudentState | null> {
    return this.studentStateRepository.findById(id);
  }

  async create(studentState: Omit<StudentState, 'id'>): Promise<StudentState> {
    return this.studentStateRepository.create(studentState);
  }

  async update(id: string, studentState: Partial<StudentState>): Promise<StudentState | null> {
    return this.studentStateRepository.update(id, studentState);
  }

  async delete(id: string): Promise<boolean> {
    return this.studentStateRepository.delete(id);
  }
}
