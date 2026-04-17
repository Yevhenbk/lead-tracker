import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";

import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";

@ApiTags("comments")
@Controller("leads/:leadId/comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @ApiOkResponse({ description: "List of comments for the lead" })
  @ApiNotFoundResponse({ description: "Lead not found" })
  findByLeadId(@Param("leadId") leadId: string) {
    return this.commentsService.findByLeadId(leadId);
  }

  @Post()
  @ApiCreatedResponse({ description: "Comment created" })
  @ApiNotFoundResponse({ description: "Lead not found" })
  create(
    @Param("leadId") leadId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(leadId, createCommentDto);
  }
}
