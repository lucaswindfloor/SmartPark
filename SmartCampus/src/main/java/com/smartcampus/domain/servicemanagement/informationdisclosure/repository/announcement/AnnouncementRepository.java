package com.smartcampus.domain.servicemanagement.informationdisclosure.repository.announcement;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smartcampus.domain.servicemanagement.informationdisclosure.entity.announcement.Announcement;

import java.util.Optional;

/**
 * 通知公告仓储接口
 */
public interface AnnouncementRepository {

    Optional<Announcement> findById(Long id);

    Announcement save(Announcement announcement);

    void deleteById(Long id);

    // Add other methods as needed, e.g., for querying by status, type, pagination
    // Page<Announcement> findByCriteria(AnnouncementCriteria criteria, Page<Announcement> page);
}
