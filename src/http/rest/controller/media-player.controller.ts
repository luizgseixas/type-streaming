import {
  Controller,
  Get,
  Header,
  HttpStatus,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { VideoNotFoundException } from '@src/core/exception/video-not-found.exception';
import { MediaPlayerService } from '@src/core/service/media-player.service';
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

@Controller()
export class MediaPlayerController {
  constructor(private readonly mediaPlayerService: MediaPlayerService) {}

  @Get('stream/:videoId')
  @Header('Content-Type', 'video/mp4')
  public async streamVideo(
    @Param('videoId') videoId: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    try {
      console.log('Batatinha');
      const url = await this.mediaPlayerService.prepareStreaming(videoId);

      if (!url) {
        return res.sendStatus(HttpStatus.NOT_FOUND);
      }

      const videoPath = path.join('.', url);
      console.log({ videoPath });
      const fileSize = fs.statSync(videoPath).size;

      const range = req.headers.range;

      console.log({ fileSize, range });
      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        const chunksize = end - start + 1;
        const file = fs.createReadStream(videoPath, { start, end });
        file.on('open', () => console.log('File opened successfully'));
        file.on('error', (err) => console.error('File read error:', err));

        res.writeHead(HttpStatus.PARTIAL_CONTENT, {
          'Content-Range': `bytes=${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
        });

        file.pipe(res).on('error', (err) => {
          console.error('Stream error:', err);
          res.status(500).send('Stream error');
        });
      } else {
        res.writeHead(HttpStatus.OK, {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
        });
        fs.createReadStream(videoPath).pipe(res);
      }
      console.log('Batatinha 2');
    } catch (error) {
      console.log({ error });
      if (error instanceof VideoNotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).send({
          message: error.message,
          error: 'Not Found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      throw error;
    }
  }
}
