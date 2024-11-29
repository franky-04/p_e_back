import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  BadRequestException,
  InternalServerErrorException
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';


@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }

  @UseGuards(JwtGuard)
  @Get('my-events')
  async getMyEvents(@Request() req) {
    console.log('User in request:', req.user);
    const userId = req.user.id;

    if (!userId) {
      throw new BadRequestException('User ID not found');
    }

    console.log('Fetching events for userId:', userId);
    const events = await this.eventsService.findByUserId(userId);

    return {
      userId: userId,
      count: events.length,
      events: events
    };
  }


  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createEventDto: CreateEventDto, @Request() req) {
    return this.eventsService.create(createEventDto, req.user.id);
  }

  @Get()
  findAll(
    @Query('active') active?: boolean,
    @Query('upcoming') upcoming?: boolean,
    @Query('category') category?: string,
    @Query('city') city?: string,
    @Query('isPublic') isPublic?: boolean,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.eventsService.findAll({
      active,
      upcoming,
      category,
      city,
      isPublic,
      page,
      limit
    });
  }

  @Get('upcoming')
  findUpcoming() {
    return this.eventsService.findUpcomingEvents();
  }

  @Get('active')
  findActive() {
    return this.eventsService.findActiveEvents();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(+id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(+id, updateEventDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(+id);
  }



}
