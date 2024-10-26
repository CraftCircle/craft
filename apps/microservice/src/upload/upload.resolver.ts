import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UploadService } from './upload.service';
import { Upload } from './entities/upload.entity';


@Resolver(() => Upload)
export class UploadResolver {
  constructor(private readonly uploadService: UploadService) {}


}
