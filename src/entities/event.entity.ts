import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Photo } from './photo.entity';
import { User } from './user.entity';


@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  location: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ type: 'int', nullable: true })
  maxParticipants: number;

  @Column({
    type: 'enum',
    enum: ['draft', 'published', 'closed'],
    default: 'draft',
  })
  status: string;

  @Column({ type: 'text', nullable: true })
  rules: string;

  @Column({ type: 'simple-array', nullable: true })
  categories: string[];

  @Column({ default: false })
  isPublic: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  entryFee: number;

  @Column({ nullable: true })
  contactEmail: string;

  @Column({ nullable: true })
  contactPhone: string;

  @Column({ type: 'json', nullable: true })
  additionalInfo: object;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ name: 'creatorId', type: 'int' })
  creatorId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @OneToMany(() => Photo, photo => photo.event)
  photos: Photo[];
}