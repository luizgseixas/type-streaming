import { Injectable } from '@nestjs/common';
import { VideoNotFoundException } from '../exception/video-not-found.exception';
import { VideoRepository } from '@contentModule/persistence/repository/video.repository';

@Injectable()
export class MediaPlayerService {
  constructor(private readonly videoRepository: VideoRepository) {}

  public async prepareStreaming(videoId: string): Promise<string> {
    const video = await this.videoRepository.findOneById(videoId);
    if (!video) {
      throw new VideoNotFoundException(`video with id ${videoId} not found`);
    }
    return video.url;
  }
}
// 45705b56-a47f-4869-b736-8f6626c940f8
