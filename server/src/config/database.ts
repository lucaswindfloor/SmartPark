import { ConnectionOptions } from 'typeorm';
import { Announcement } from '../models/announcement.entity';
import { AnnouncementView } from '../models/announcement-view.entity';
import { AnnouncementConfirm } from '../models/announcement-confirm.entity';
import { AnnouncementAudit } from '../models/announcement-audit.entity';

const config: ConnectionOptions = {
  type: 'sqlite',
  database: process.env.DB_PATH || './database/smartpark.db',
  entities: [
    Announcement,
    AnnouncementView,
    AnnouncementConfirm,
    AnnouncementAudit
  ],
  synchronize: true,
  logging: true
};

export default config; 