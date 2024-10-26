import { Module } from '@nestjs/common';
import { PostService } from './posts.service';
import { PostResolver } from './posts.resolver';
import { UploadModule } from '../upload/upload.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [UploadModule, PrismaModule],
  providers: [PostResolver, PostService],
})
export class PostModule {}
