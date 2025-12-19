export interface StudentState {
  id: string;
  name: string;
  state: string;
  // Add other properties as needed
}

export interface IStudentStateRepository {
  findAll(): Promise<StudentState[]>;
  findById(id: string): Promise<StudentState | null>;
  create(studentState: Omit<StudentState, 'id'>): Promise<StudentState>;
  update(id: string, studentState: Partial<StudentState>): Promise<StudentState | null>;
  delete(id: string): Promise<boolean>;
}
