package com.smartcampus.infrastructure.persistence.mysql.repository.servicemanagement.informationdisclosure.announcement;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smartcampus.domain.servicemanagement.informationdisclosure.entity.announcement.Announcement;
import com.smartcampus.domain.servicemanagement.informationdisclosure.repository.announcement.AnnouncementRepository;
import com.smartcampus.infrastructure.persistence.mysql.mapper.servicemanagement.informationdisclosure.announcement.AnnouncementMapper;
import com.smartcampus.platform.comprehensive.servicemanagement.dto.informationdisclosure.announcement.AnnouncementDTO;
import com.smartcampus.platform.comprehensive.servicemanagement.dto.informationdisclosure.announcement.request.AnnouncementQueryDTO;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Implementation of the AnnouncementRepository using MyBatis Plus.
 */
@Repository
public class AnnouncementRepositoryImpl implements AnnouncementRepository {

    @Autowired
    private AnnouncementMapper announcementMapper;

    @Override
    public Page<AnnouncementDTO> findPage(Page<Announcement> page, AnnouncementQueryDTO query) {
        // Delegate the custom query execution to the mapper
        return announcementMapper.selectAnnouncementPage(page, query);
    }

    @Override
    public Announcement findById(Long id) {
        return announcementMapper.selectById(id);
    }

    @Override
    public void save(Announcement announcement) {
        if (announcement.getId() == null) {
            announcementMapper.insert(announcement);
        } else {
            announcementMapper.updateById(announcement);
        }
    }

    @Override
    public void updateById(Announcement announcement) {
        announcementMapper.updateById(announcement);
    }

    @Override
    public void deleteById(Long id) {
        announcementMapper.deleteById(id); // MyBatis Plus handles logical delete if @TableLogic is present
    }
    
    @Override
    public void recoverById(Long id) {
        // We need to manually update the delete_flag field since MyBatis Plus doesn't provide a direct "recover" method
        Announcement announcement = findById(id);
        if (announcement != null) {
            // Set delete_flag to 0 to recover the entity
            announcement.setDeleteFlag(0);
            updateById(announcement);
        }
    }
}
