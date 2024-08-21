import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ContentManagementService } from '@src/core/service/content-management.service';
import { randomUUID } from 'crypto';
import type { Request } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateVideoResponseDto } from '../dto/response/create-video-response';
import { RestResponseInterceptor } from '../interceptor/rest-response.interceptor';

@Controller()
export class ContentController {
  constructor(
    private readonly contentManagementService: ContentManagementService,
  ) {}

  @Post('video')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'video', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
      ],
      {
        dest: './uploads',
        storage: diskStorage({
          destination: './uploads',
          filename: (_req, file, cb) => {
            return cb(
              null,
              `${Date.now()}-${randomUUID()}${extname(file.originalname)}`,
            );
          },
        }),
        fileFilter: (_req, file, cb) => {
          if (file.mimetype !== 'video/mp4' && file.mimetype !== 'image/jpeg') {
            return cb(
              new BadRequestException(
                'Invalid file type. Only video/mp4 and image/jpeg are supported.',
              ),
              false,
            );
          }
          return cb(null, true);
        },
      },
    ),
  )
  @UseInterceptors(new RestResponseInterceptor(CreateVideoResponseDto))
  public async uploadVideo(
    @Req() _req: Request,
    @Body()
    contentData: {
      title: string;
      description: string;
    },
    @UploadedFiles()
    files: { video?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] },
  ): Promise<CreateVideoResponseDto> {
    const videoFile = files.video?.[0];
    const thumbnailFile = files.thumbnail?.[0];

    if (!videoFile || !thumbnailFile) {
      throw new BadRequestException(
        'Both video and thumbnail files are required.',
      );
    }

    const createdContent = await this.contentManagementService.createContent({
      title: contentData.title,
      description: contentData.description,
      url: videoFile.path,
      thumbnailUrl: thumbnailFile.path,
      sizeInKb: videoFile.size,
    });
    const video = createdContent.getMedia()?.getVideo();
    if (!video) {
      throw new BadRequestException('Video must be present');
    }

    return {
      id: createdContent.getId(),
      title: createdContent.getTitle(),
      description: createdContent.getDescription(),
      url: video.getUrl(),
      createdAt: createdContent.getCreatedAt(),
      updatedAt: createdContent.getUpdatedAt(),
    };
  }
}
