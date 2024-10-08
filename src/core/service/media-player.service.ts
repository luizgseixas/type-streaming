import { Injectable } from '@nestjs/common';
import { VideoNotFoundException } from '../exception/video-not-found.exception';
import { VideoRepository } from '@src/persistence/repository/video.repository';

@Injectable()
export class MediaPlayerService {
  constructor(private readonly videoRepository: VideoRepository) {}

  public async prepareStreaming(videoId: string): Promise<string> {
    const video = await this.videoRepository.findById(videoId);
    console.log({ video, url: video?.getUrl() });
    if (!video) {
      throw new VideoNotFoundException(`video with id ${videoId} not found`);
    }
    return video?.getUrl();
  }
}
