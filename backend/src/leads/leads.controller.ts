import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";

import { CreateLeadDto } from "./dto/create-lead.dto";
import { QueryLeadsDto } from "./dto/query-leads.dto";
import { UpdateLeadDto } from "./dto/update-lead.dto";
import { LeadsService } from "./leads.service";

@ApiTags("leads")
@Controller("leads")
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  @ApiOkResponse({ description: "List of leads with pagination" })
  findAll(@Query() queryLeadsDto: QueryLeadsDto) {
    return this.leadsService.findAll(queryLeadsDto);
  }

  @Get(":id")
  @ApiOkResponse({ description: "Lead details" })
  @ApiNotFoundResponse({ description: "Lead not found" })
  findOne(@Param("id") id: string) {
    return this.leadsService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({ description: "Lead created" })
  create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.create(createLeadDto);
  }

  @Patch(":id")
  @ApiOkResponse({ description: "Lead updated" })
  @ApiNotFoundResponse({ description: "Lead not found" })
  update(@Param("id") id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadsService.update(id, updateLeadDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: "Lead deleted" })
  @ApiNotFoundResponse({ description: "Lead not found" })
  remove(@Param("id") id: string) {
    return this.leadsService.remove(id);
  }
}
