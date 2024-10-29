import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: (config: ConfigService) => {
    const logger = new Logger('CloudinaryProvider');
    
    
    logger.log('Initializing Cloudinary with configuration:');
    logger.log(`Cloud Name: ${config.get('CLOUDINARY_CLOUD_NAME')}`);
    logger.log(`API Key: ${config.get('CLOUDINARY_API_KEY') ? '****' : 'Not Set'}`); 
    logger.log(`API Secret: ${config.get('CLOUDINARY_API_SECRET') ? '****' : 'Not Set'}`); 

    cloudinary.config({
      cloud_name: config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: config.get('CLOUDINARY_API_KEY'),
      api_secret: config.get('CLOUDINARY_API_SECRET'),
    });

    logger.log('Cloudinary configuration completed.');
    return cloudinary;
  },
  inject: [ConfigService],
};
