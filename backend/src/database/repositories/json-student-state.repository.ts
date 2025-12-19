import { Injectable } from '@nestjs/common';
import { IStudentStateRepository, StudentState } from '../../retencion/interfaces/student-state.repository';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class JsonStudentStateRepository implements IStudentStateRepository {
  private readonly dataPath: string;

  constructor() {
    this.dataPath = path.join(process.cwd(), 'output', 'output.json');
  }

  async findAll(): Promise<StudentState[]> {
    try {
      const data = await fs.readFile(this.dataPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async findById(id: string): Promise<StudentState | null> {
    const students = await this.findAll();
    return students.find(s => s.id === id) || null;
  }

  async create(studentState: Omit<StudentState, 'id'>): Promise<StudentState> {
    const students = await this.findAll();
    const newStudent: StudentState = {
      ...studentState,
      id: Date.now().toString(),
    };
    students.push(newStudent);
    await this.saveData(students);
    return newStudent;
  }

  async update(id: string, studentState: Partial<StudentState>): Promise<StudentState | null> {
    const students = await this.findAll();
    const index = students.findIndex(s => s.id === id);
    
    if (index === -1) {
      return null;
    }

    students[index] = { ...students[index], ...studentState };
    await this.saveData(students);
    return students[index];
  }

  async delete(id: string): Promise<boolean> {
    const students = await this.findAll();
    const initialLength = students.length;
    const filtered = students.filter(s => s.id !== id);
    
    if (filtered.length === initialLength) {
      return false;
    }

    await this.saveData(filtered);
    return true;
  }

  private async saveData(data: StudentState[]): Promise<void> {
    await fs.writeFile(this.dataPath, JSON.stringify(data, null, 2), 'utf-8');
  }
}
