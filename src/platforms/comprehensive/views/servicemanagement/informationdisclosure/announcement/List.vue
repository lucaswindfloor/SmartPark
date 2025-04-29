import {
  fetchNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  publishNotification,
  withdrawNotification,
  auditNotification,
  archiveNotification,
  extendNotificationValidity
} from '@/platforms/comprehensive/api/service/informationdisclosure/announcement.js'
import moment from 'moment'
import OperationComponent from './components/OperationComponent.vue' 