import { CreateContentData } from '@src/core/service/content-management.service';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';

export class VideoDAO {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(videoData: CreateContentData) {
    const { title, description, url, thumbnailUrl, sizeInKb } = videoData;
    return this.prismaService.video.create({
      data: {
        id: randomUUID(),
        title,
        description,
        url,
        thumbnailUrl,
        sizeInKb,
        duration: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }
}
