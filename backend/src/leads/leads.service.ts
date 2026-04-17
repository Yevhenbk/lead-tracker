import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { QueryLeadsDto } from "./dto/query-leads.dto";
import { UpdateLeadDto } from "./dto/update-lead.dto";

@Injectable()
export class LeadsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(queryLeadsDto: QueryLeadsDto) {
    const {
      page = 1,
      limit = 10,
      status,
      q,
      sort = "createdAt",
      order = "desc",
    } = queryLeadsDto;

    const where: Prisma.LeadWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { company: { contains: q, mode: "insensitive" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      this.prismaService.lead.findMany({
        where,
        orderBy: { [sort]: order },
        skip,
        take: limit,
        include: { _count: { select: { comments: true } } },
      }),
      this.prismaService.lead.count({ where }),
    ]);

    return {
      data: leads,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const lead = await this.prismaService.lead.findUnique({
      where: { id },
      include: { _count: { select: { comments: true } } },
    });

    if (!lead) {
      throw new NotFoundException(`Lead with id ${id} not found`);
    }

    return lead;
  }

  async create(createLeadDto: CreateLeadDto) {
    return this.prismaService.lead.create({
      data: createLeadDto,
      include: { _count: { select: { comments: true } } },
    });
  }

  async update(id: string, updateLeadDto: UpdateLeadDto) {
    await this.findOne(id);

    return this.prismaService.lead.update({
      where: { id },
      data: updateLeadDto,
      include: { _count: { select: { comments: true } } },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prismaService.lead.delete({ where: { id } });
  }
}
