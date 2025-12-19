import { Controller, Get, Query } from '@nestjs/common';
import { RetencionService, ResumenAnual, ResumenCarrera } from './retencion.service';
import { StudentStatus, Carrera, FilterOptions } from './interfaces/student-status.repository';

@Controller('retencion')
export class RetencionController {
  constructor(private readonly retencionService: RetencionService) {}

  @Get()
  async findAll(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('cod_estado') cod_estado?: string,
    @Query('cod_admision') cod_admision?: string,
    @Query('cod_programa') cod_programa?: string,
  ): Promise<StudentStatus[]> {
    const filters: FilterOptions = {
      from,
      to,
      cod_estado,
      cod_admision,
      cod_programa,
    };
    return this.retencionService.findAll(filters);
  }

  @Get('resumen')
  async getResumen(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('cod_admision') cod_admision?: string,
  ): Promise<ResumenAnual[]> {
    const filters: FilterOptions = {
      from,
      to,
      cod_admision,
    };
    return this.retencionService.getResumen(filters);
  }

  @Get('resumen/carreras')
  async getResumenByCarrera(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('cod_admision') cod_admision?: string,
    @Query('cod_programa') cod_programa?: string,
  ): Promise<ResumenCarrera[]> {
    const filters: FilterOptions = {
      from,
      to,
      cod_admision,
      cod_programa,
    };
    return this.retencionService.getResumenByCarrera(filters);
  }

  @Get('carreras')
  async getCarreras(): Promise<Carrera[]> {
    return this.retencionService.getCarreras();
  }
}
