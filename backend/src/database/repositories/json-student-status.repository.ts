import { Injectable } from '@nestjs/common';
import {
  IStudentStatusRepository,
  StudentStatus,
  FilterOptions,
  Carrera,
} from '../../retencion/interfaces/student-status.repository';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class JsonStudentStatusRepository implements IStudentStatusRepository {
  private readonly dataPath: string;

  constructor() {
    this.dataPath = path.join(process.cwd(), 'data', 'output.json');
  }

  async findAll(): Promise<StudentStatus[]> {
    try {
      const data = await fs.readFile(this.dataPath, 'utf-8');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async findAllWithFilters(filters: FilterOptions): Promise<StudentStatus[]> {
    const allStudents = await this.findAll();
    
    return allStudents.filter((status) => {
      // Filter by year range
      if (filters.from && status.year_admision < filters.from) {
        return false;
      }
      if (filters.to && status.year_admision > filters.to) {
        return false;
      }
      
      // Filter by cod_estado
      if (filters.cod_estado && status.cod_estado !== filters.cod_estado) {
        return false;
      }
      
      // Filter by cod_admision
      if (filters.cod_admision && status.cod_admision !== filters.cod_admision) {
        return false;
      }
      
      // Filter by cod_programa
      if (filters.cod_programa && status.cod_programa !== filters.cod_programa) {
        return false;
      }
      
      return true;
    });
  }

  async findCarreras(): Promise<Carrera[]> {
    const allStudents = await this.findAll();
    const carrerasMap = new Map<string, Carrera>();
    
    allStudents.forEach((status) => {
      if (!carrerasMap.has(status.cod_programa)) {
        carrerasMap.set(status.cod_programa, {
          cod_programa: status.cod_programa,
          nombre_estandar: status.nombre_estandar,
        });
      }
    });
    
    return Array.from(carrerasMap.values()).sort((a, b) => 
      a.nombre_estandar.localeCompare(b.nombre_estandar)
    );
  }
}
