package com.smartcampus.infrastructure.persistence.mysql.mapper.servicemanagement.informationdisclosure.announcement;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.smartcampus.domain.servicemanagement.informationdisclosure.entity.announcement.AnnouncementRead;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AnnouncementReadMapper extends BaseMapper<AnnouncementRead> {
    List<AnnouncementRead> selectByAnnouncementId(@Param("announcementId") Long announcementId);
    
    AnnouncementRead selectByAnnouncementIdAndUsername(@Param("announcementId") Long announcementId, @Param("username") String username);
    
    int countByAnnouncementId(@Param("announcementId") Long announcementId);
} 