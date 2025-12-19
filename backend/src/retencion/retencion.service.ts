import { Injectable } from '@nestjs/common';
import {
  StudentStatus,
  FilterOptions,
  Carrera,
} from './interfaces/student-status.repository';
import { JsonStudentStatusRepository } from '../database/repositories/json-student-status.repository';

export interface ResumenAnual {
  year: string;
  matriculados_primera_vez: number;
  matriculados_anio_siguiente: number;
  tasa_retencion: number;
}

export interface ResumenCarrera extends ResumenAnual {
  cod_programa: string;
  nombre_programa: string;
}

@Injectable()
export class RetencionService {
  constructor(
    private readonly studentStatusRepository: JsonStudentStatusRepository,
  ) {}

  async findAll(filters: FilterOptions): Promise<StudentStatus[]> {
    return this.studentStatusRepository.findAllWithFilters(filters);
  }

  async getResumen(filters: FilterOptions): Promise<ResumenAnual[]> {
    const statuses = await this.studentStatusRepository.findAllWithFilters(filters);
    return this.calculateRetencion(statuses);
  }

  async getResumenByCarrera(
    filters: FilterOptions,
  ): Promise<ResumenCarrera[]> {
    const statuses = await this.studentStatusRepository.findAllWithFilters(filters);
    
    // Group statuses by program (carrera)
    const programsMap = new Map<string, StudentStatus[]>();
    statuses.forEach((status) => {
      if (!programsMap.has(status.cod_programa)) {
        programsMap.set(status.cod_programa, []);
      }
      programsMap.get(status.cod_programa)!.push(status);
    });

    const resumen: ResumenCarrera[] = [];
    
    // Calculate retencion for each program (carrera)
    for (const [cod_programa, programStudents] of programsMap.entries()) {
      const retencionData = this.calculateRetencion(programStudents);
      const nombre_programa = programStudents[0]?.nombre_estandar || '';
      
      retencionData.forEach((data) => {
        resumen.push({
          ...data,
          cod_programa,
          nombre_programa,
        });
      });
    }

    return resumen.sort((a, b) => {
      const yearCompare = a.year.localeCompare(b.year);
      if (yearCompare !== 0) return yearCompare;
      return a.nombre_programa.localeCompare(b.nombre_programa);
    });
  }

  async getCarreras(): Promise<Carrera[]> {
    return this.studentStatusRepository.findCarreras();
  }

  private calculateRetencion(statuses: StudentStatus[]): ResumenAnual[] {
    // Group statuses by admission year, storing rut and cod_programa
    const yearMap = new Map<string, Map<string, string>>();
    
    statuses.forEach((status) => {
      // Only count students with status 'M' (Matriculado)
      if (status.year_admision === status.year_estado && status.cod_estado === 'M') {
        if (!yearMap.has(status.year_admision)) {
          yearMap.set(status.year_admision, new Map());
        }
        yearMap.get(status.year_admision)!.set(status.rut, status.cod_programa);
      }
    });

    const resumen: ResumenAnual[] = [];

    // Calculate retencion for each year
    for (const [year, rutProgramMap] of yearMap.entries()) {
      const nextYear = (parseInt(year) + 1).toString();
      
      // Find statuses from this admission year who have records in the next year
      const retainedRuts = new Set<string>();
      statuses.forEach((status) => {
        if (
          rutProgramMap.has(status.rut) &&
          status.year_estado === nextYear &&
          status.cod_estado === 'M' &&
          status.cod_programa === rutProgramMap.get(status.rut)
        ) {
          retainedRuts.add(status.rut);
        }
      });

      const matriculados_primera_vez = rutProgramMap.size;
      const matriculados_anio_siguiente = retainedRuts.size;
      const tasa_retencion =
        matriculados_primera_vez > 0
          ? (matriculados_anio_siguiente / matriculados_primera_vez)
          : 0;

      resumen.push({
        year,
        matriculados_primera_vez,
        matriculados_anio_siguiente,
        tasa_retencion: Math.round(tasa_retencion * 100) / 100,
      });
    }

    return resumen.sort((a, b) => a.year.localeCompare(b.year));
  }
}
