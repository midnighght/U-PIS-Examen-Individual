export interface StudentStatus {
  rut: string;
  nombre: string;
  year_admision: string;
  cod_admision: string;
  admision: string;
  cod_programa: string;
  nombre_estandar: string;
  catalogo: string;
  correlativo: string;
  year_estado: string;
  cod_estado: string;
  nombre_estado: string;
}

export interface FilterOptions {
  from?: string;
  to?: string;
  cod_estado?: string;
  cod_admision?: string;
  cod_programa?: string;
}

export interface Carrera {
  cod_programa: string;
  nombre_estandar: string;
}

export interface IStudentStatusRepository {
  findAll(): Promise<StudentStatus[]>;
  findAllWithFilters(filters: FilterOptions): Promise<StudentStatus[]>;
  findCarreras(): Promise<Carrera[]>;
}
