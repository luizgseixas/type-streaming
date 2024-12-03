import { Module } from '@nestjs/common';
import { ContentModule } from '@contentModule/content.module';

@Module({
  imports: [ContentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
