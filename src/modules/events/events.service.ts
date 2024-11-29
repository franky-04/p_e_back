import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, DataSource } from 'typeorm';
import { Event } from '../../entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private dataSource: DataSource,
  ) { }

  async create(createEventDto: CreateEventDto, creatorId: number) {
    const event = this.eventRepository.create({
      ...createEventDto,
      creatorId,
    });
    return await this.eventRepository.save(event);
  }

  async findAll(options?: {
    active?: boolean;
    upcoming?: boolean;
    category?: string;
    city?: string;
    isPublic?: boolean;
    page?: number;
    limit?: number;
  }) {
    const query = this.eventRepository.createQueryBuilder('event')
      .leftJoinAndSelect('event.photos', 'photo')
      .orderBy('event.startDate', 'ASC');

    if (options?.active) {
      query.where('event.endDate >= :now', { now: new Date() });
    }

    if (options?.upcoming) {
      query.where('event.startDate >= :now', { now: new Date() });
    }

    if (options?.category) {
      query.andWhere('event.categories LIKE :category', { category: `%${options.category}%` });
    }

    if (options?.city) {
      query.andWhere('event.city = :city', { city: options.city });
    }

    if (options?.isPublic !== undefined) {
      query.andWhere('event.isPublic = :isPublic', { isPublic: options.isPublic });
    }

    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const [events, total] = await query
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      events,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }


  async findOne(id: number) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['photos']
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    const event = await this.findOne(id);

    if (updateEventDto.startDate && updateEventDto.endDate) {
      if (updateEventDto.endDate < updateEventDto.startDate) {
        throw new BadRequestException('End date must be after start date');
      }
    } else if (
      updateEventDto.startDate &&
      updateEventDto.startDate > event.endDate
    ) {
      throw new BadRequestException(
        'New start date cannot be after current end date',
      );
    } else if (
      updateEventDto.endDate &&
      updateEventDto.endDate < event.startDate
    ) {
      throw new BadRequestException(
        'New end date cannot be before current start date',
      );
    }

    Object.assign(event, updateEventDto);
    return await this.eventRepository.save(event);
  }

  async remove(id: number) {
    const event = await this.findOne(id);
    return await this.eventRepository.remove(event);
  }

  async findUpcomingEvents() {
    return await this.eventRepository.find({
      where: {
        startDate: MoreThanOrEqual(new Date())
      },
      order: {
        startDate: 'ASC'
      }
    });
  }

  async findActiveEvents() {
    const now = new Date();
    return await this.eventRepository.find({
      where: {
        startDate: Between(
          now,
          new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        ), // prossimi 7 giorni
      },
      relations: ['photos'],
      order: {
        startDate: 'ASC'
      }
    });
  }

  async findByUserId(userId: number): Promise<Event[]> {
    try {
      console.log('Finding events for userId:', userId);

      // Query esplicita per creatorId
      const events = await this.eventRepository
        .createQueryBuilder('event')
        .where('event.creatorId = :userId', { userId })
        .leftJoinAndSelect('event.photos', 'photos')
        .orderBy('event.createdAt', 'DESC')
        .getMany();

      console.log(`Found ${events.length} events for user ${userId}`);
      console.log('Events:', events); // Per debug

      return events;
    } catch (error) {
      console.error('Error in findByUserId:', {
        userId,
        error: error.message
      });
      throw error;
    }
  }
}