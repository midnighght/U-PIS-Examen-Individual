import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { RetencionService } from './retencion.service';
import { StudentState } from './interfaces/student-state.repository';

@Controller('retencion')
export class RetencionController {
  constructor(private readonly retencionService: RetencionService) {}

  @Get()
  async findAll(): Promise<StudentState[]> {
    return this.retencionService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<StudentState | null> {
    return this.retencionService.findById(id);
  }

  @Post()
  async create(@Body() studentState: Omit<StudentState, 'id'>): Promise<StudentState> {
    return this.retencionService.create(studentState);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() studentState: Partial<StudentState>,
  ): Promise<StudentState | null> {
    return this.retencionService.update(id, studentState);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ success: boolean }> {
    const success = await this.retencionService.delete(id);
    return { success };
  }
}
