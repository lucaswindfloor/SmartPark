import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('announcement_audits')
export class AnnouncementAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  announcementId: number;

  @Column()
  auditorId: number;

  @Column()
  action: number;

  @Column({ nullable: true })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;
} 