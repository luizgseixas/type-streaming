import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { ContentManagementService } from '@src/core/service/content-management.service';
import { VideoRepository } from '@src/persistence/repository/video.repository';
import fs from 'fs';
import request from 'supertest';

describe('MediaPlayerController (e2e)', () => {
  let module: TestingModule;
  let app: INestApplication;
  let videoRepository: VideoRepository;
  let contentManagementService: ContentManagementService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    videoRepository = module.get<VideoRepository>(VideoRepository);
    contentManagementService = module.get<ContentManagementService>(
      ContentManagementService,
    );
  });

  beforeEach(async () => {
    jest
      .useFakeTimers({ advanceTimers: true })
      .setSystemTime(new Date('2023-01-01'));
  });

  afterEach(async () => {
    await videoRepository.deleteAll();
  });

  afterAll(async () => {
    module.close();
    fs.rmSync('./uploads', { recursive: true, force: true });
  });

  describe('/stream/:videoId', () => {
    it.only('streams a video', async () => {
      const createContent = await contentManagementService.createContent({
        title: 'Test Video',
        description: 'This is a test video',
        url: './test/fixtures/sample.mp4',
        thumbnailUrl: './test/fixtures/sample.jpg',
        sizeInKb: 32140847,
      });
      const fileSize = 32140847;
      const range = `bytes=0-${fileSize - 1}`;

      console.log({ videoId: createContent.getMedia()?.getVideo().getId() });

      const response = await request(app.getHttpServer())
        .get(`/stream/${createContent.getMedia()?.getVideo().getId()}`)
        .set('Range', range)
        .expect(HttpStatus.PARTIAL_CONTENT);

      console.log({ response });

      expect(response.headers['content-range']).toBe(
        `bytes=0-${fileSize - 1}/${fileSize}`,
      );
      expect(response.headers['accept-ranges']).toBe('bytes');
      expect(response.headers['content-length']).toBe(String(fileSize));
      expect(response.headers['content-type']).toBe('video/mp4');
    });

    it('returns 404 if the video is not found', async () => {
      await request(app.getHttpServer())
        .get('/stream/45705b56-a47f-4869-b736-8f6626c940f8')
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
