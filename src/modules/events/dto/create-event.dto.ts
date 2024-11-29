import { IsNotEmpty, IsString, IsDate, MinDate, IsOptional, IsInt, Min, IsEnum, IsBoolean, IsEmail, IsPhoneNumber, IsNumber, IsArray, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @MinDate(new Date())
  startDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @MinDate(new Date())
  endDate: Date;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxParticipants?: number;

  @IsOptional()
  @IsEnum(['draft', 'published', 'closed'])
  status?: string;

  @IsOptional()
  @IsString()
  rules?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  entryFee?: number;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message:
      'Il numero di telefono deve essere in formato internazionale (es: +39123456789)',
  })
  contactPhone?: string;

  @IsOptional()
  additionalInfo?: object;
}