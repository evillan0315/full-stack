import { ApiProperty } from '@nestjs/swagger';

export class ImageCaptionDto {
  @ApiProperty({ example: 'https://example.com/image.jpg' })
  imageUrl: string;

  @ApiProperty({ example: 'Caption this image.', required: false })
  prompt?: string;
}

