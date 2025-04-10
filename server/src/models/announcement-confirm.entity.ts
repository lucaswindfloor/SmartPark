import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('announcement_confirms')
export class AnnouncementConfirm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  announcementId: number;

  @Column()
  userId: number;

  @CreateDateColumn()
  confirmedAt: Date;
} 