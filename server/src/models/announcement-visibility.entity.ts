import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('announcement_visibilities')
export class AnnouncementVisibility {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  announcementId: number;

  @Column()
  visibilityType: string; // 'enterprise', 'employee', 'public'

  @CreateDateColumn()
  createdAt: Date;
} 