import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreatePhotoDto {
  @IsNotEmpty()
  @IsNumber()
  eventId: number;

  @IsOptional()
  @IsString()
  description?: string;
}