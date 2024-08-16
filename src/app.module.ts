import { Module } from '@nestjs/common';
import { ContentController } from './http/rest/controller/content.controller';
import { PrismaService } from '@src/persistence/prisma.service';
import { ContentManagementService } from './core/service/content-management.service';
import { MediaPlayerService } from './core/service/media-player.service';

@Module({
  imports: [],
  controllers: [ContentController],
  providers: [PrismaService, ContentManagementService, MediaPlayerService],
})
export class AppModule {}
