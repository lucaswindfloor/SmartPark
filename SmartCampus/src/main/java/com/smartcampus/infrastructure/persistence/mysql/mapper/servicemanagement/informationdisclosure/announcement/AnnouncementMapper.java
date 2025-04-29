package com.smartcampus.infrastructure.persistence.mysql.mapper.servicemanagement.informationdisclosure.announcement;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smartcampus.domain.servicemanagement.informationdisclosure.entity.announcement.Announcement;
import com.smartcampus.platform.comprehensive.servicemanagement.dto.informationdisclosure.announcement.AnnouncementDTO;
import com.smartcampus.platform.comprehensive.servicemanagement.dto.informationdisclosure.announcement.request.AnnouncementQueryDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * MyBatis Plus Mapper for the Announcement entity.
 */
@Mapper
public interface AnnouncementMapper extends BaseMapper<Announcement> {

    /**
     * Custom query to find announcements with pagination and joined data.
     *
     * @param page Pagination object.
     * @param query Query parameters DTO.
     * @return Page of AnnouncementDTO.
     */
    Page<AnnouncementDTO> selectAnnouncementPage(Page<Announcement> page, @Param("query") AnnouncementQueryDTO query);

    // BaseMapper provides basic CRUD methods (selectById, insert, updateById, deleteById, etc.)
    // Add other custom queries here if needed, corresponding to methods in AnnouncementRepository
}
