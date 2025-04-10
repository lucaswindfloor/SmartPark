import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('announcement_views')
export class AnnouncementView {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  announcementId: number;

  @Column()
  userId: number;

  @CreateDateColumn()
  viewedAt: Date;
} 