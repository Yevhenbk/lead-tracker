import { Module } from "@nestjs/common";

import { PrismaModule } from "./prisma/prisma.module";
import { LeadsModule } from "./leads/leads.module";
import { CommentsModule } from "./comments/comments.module";

@Module({
  imports: [PrismaModule, LeadsModule, CommentsModule],
})
export class AppModule {}
