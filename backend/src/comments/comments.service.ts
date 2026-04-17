import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { CreateCommentDto } from "./dto/create-comment.dto";

@Injectable()
export class CommentsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByLeadId(leadId: string) {
    const lead = await this.prismaService.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      throw new NotFoundException(`Lead with id ${leadId} not found`);
    }

    return this.prismaService.comment.findMany({
      where: { leadId },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(leadId: string, createCommentDto: CreateCommentDto) {
    const lead = await this.prismaService.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      throw new NotFoundException(`Lead with id ${leadId} not found`);
    }

    return this.prismaService.comment.create({
      data: { leadId, text: createCommentDto.text },
    });
  }
}
