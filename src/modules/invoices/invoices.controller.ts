import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { ApiResponse, ApiTags, ApiBody, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../users/user.decorator';
import { User } from '@prisma/client';

@ApiTags('Invoices')
@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new invoice and generates a new pdf file',
  })
  @ApiResponse({
    status: 201,
    description: 'The invoice has been successfully created.',
  })
  @ApiBody({ type: CreateInvoiceDto })
  async create(
    @Body() createInvoiceDto: CreateInvoiceDto,
    @CurrentUser() user: User,
  ) {
    return await this.invoicesService.create(createInvoiceDto , user.id );
  }

  @Get()
  @ApiOperation({ summary: 'Get all invoices for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Returns the list of invoices for the current user.',
  })
  async findAll(@CurrentUser() user: User) {
    return await this.invoicesService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific invoice' })
  @ApiResponse({
    status: 200,
    description: 'Returns the details of the specified invoice.',
  })
  @ApiResponse({ status: 404, description: 'Invoice not found.' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return await this.invoicesService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update details of a specific invoice' })
  @ApiResponse({
    status: 200,
    description: 'The invoice has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Invoice not found.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
    @CurrentUser() user: User,
  ) {
    return await this.invoicesService.update(id, updateInvoiceDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific invoice' })
  @ApiResponse({
    status: 200,
    description: 'The invoice has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Invoice not found.' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return await this.invoicesService.remove(id, user.id);
  }
}
