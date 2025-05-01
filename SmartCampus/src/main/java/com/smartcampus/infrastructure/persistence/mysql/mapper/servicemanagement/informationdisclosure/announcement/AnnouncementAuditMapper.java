package com.smartcampus.infrastructure.persistence.mysql.mapper.servicemanagement.informationdisclosure.announcement;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.smartcampus.domain.servicemanagement.informationdisclosure.entity.announcement.AnnouncementAudit;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AnnouncementAuditMapper extends BaseMapper<AnnouncementAudit> {
    List<AnnouncementAudit> selectByAnnouncementId(@Param("announcementId") Long announcementId);
} 