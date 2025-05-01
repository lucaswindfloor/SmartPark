package com.smartcampus.infrastructure.persistence.mysql.mapper.servicemanagement.informationdisclosure.announcement;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.smartcampus.domain.servicemanagement.informationdisclosure.entity.announcement.AnnouncementRecycleBin;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface AnnouncementRecycleBinMapper extends BaseMapper<AnnouncementRecycleBin> {
    AnnouncementRecycleBin selectByAnnouncementId(@Param("announcementId") Long announcementId);
} 