import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { RetencionService, ResumenAnual, ResumenCarrera } from './retencion.service';
import { StudentStatus, Carrera, FilterOptions } from './interfaces/student-status.repository';

@ApiTags('retencion')
@Controller('retencion')
export class RetencionController {
  constructor(private readonly retencionService: RetencionService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los estados academicos con filtros opcionales' })
  @ApiQuery({ name: 'from', required: false, description: 'Año de inicio (AAAA)' })
  @ApiQuery({ name: 'to', required: false, description: 'Año tope (AAAA)' })
  @ApiQuery({ name: 'cod_estado', required: false, description: 'Código de estado académico' })
  @ApiQuery({ name: 'cod_admision', required: false, description: 'Código de admisión' })
  @ApiQuery({ name: 'cod_programa', required: false, description: 'Código de programa' })
  @ApiResponse({ status: 200, description: 'Lista de estados académicos', type: [Object] })
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
  @ApiOperation({ summary: 'Obtener resumen de estados académicos por año' })
  @ApiQuery({ name: 'from', required: false, description: 'Año de inicio (AAAA)' })
  @ApiQuery({ name: 'to', required: false, description: 'Año tope (AAAA)' })
  @ApiQuery({ name: 'cod_admision', required: false, description: 'Código de admisión' })
  @ApiResponse({ status: 200, description: 'Resumen anual', type: [Object] })
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
  @ApiOperation({ summary: 'Obtener resumen anual agrupado por programa/carrera' })
  @ApiQuery({ name: 'from', required: false, description: 'Año de inicio (AAAA)' })
  @ApiQuery({ name: 'to', required: false, description: 'Año tope (AAAA)' })
  @ApiQuery({ name: 'cod_admision', required: false, description: 'Código de admisión' })
  @ApiQuery({ name: 'cod_programa', required: false, description: 'Código de programa' })
  @ApiResponse({ status: 200, description: 'Resumen por carrera', type: [Object] })
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
  @ApiOperation({ summary: 'Obtener todos los programas/carreras disponibles' })
  @ApiResponse({ status: 200, description: 'Lista de carreras', type: [Object] })
  async getCarreras(): Promise<Carrera[]> {
    return this.retencionService.getCarreras();
  }
}
