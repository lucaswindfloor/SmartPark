package com.smartcampus.infrastructure.persistence.mysql.mapper.servicemanagement.informationdisclosure.announcement;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.smartcampus.domain.servicemanagement.informationdisclosure.entity.announcement.Announcement;
import org.apache.ibatis.annotations.Mapper;

/**
 * 通知公告Mapper接口
 */
@Mapper
public interface AnnouncementMapper extends BaseMapper<Announcement> {
    // BaseMapper provides basic CRUD. Add custom SQL methods here if needed.
}
