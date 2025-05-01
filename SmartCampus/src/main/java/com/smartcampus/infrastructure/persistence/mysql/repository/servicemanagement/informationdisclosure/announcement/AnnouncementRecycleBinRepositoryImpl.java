package com.smartcampus.infrastructure.persistence.mysql.repository.servicemanagement.informationdisclosure.announcement;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.smartcampus.domain.servicemanagement.informationdisclosure.entity.announcement.AnnouncementRecycleBin;
import com.smartcampus.domain.servicemanagement.informationdisclosure.repository.announcement.AnnouncementRecycleBinRepository;
import com.smartcampus.infrastructure.persistence.mysql.mapper.servicemanagement.informationdisclosure.announcement.AnnouncementRecycleBinMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class AnnouncementRecycleBinRepositoryImpl implements AnnouncementRecycleBinRepository {
    @Autowired
    private AnnouncementRecycleBinMapper recycleBinMapper;
    
    @Override
    public void save(AnnouncementRecycleBin recycleBin) {
        if (recycleBin.getId() == null) {
            recycleBinMapper.insert(recycleBin);
        } else {
            recycleBinMapper.updateById(recycleBin);
        }
    }
    
    @Override
    public AnnouncementRecycleBin findByAnnouncementId(Long announcementId) {
        return recycleBinMapper.selectByAnnouncementId(announcementId);
    }
    
    @Override
    public void recoverAnnouncement(Long announcementId) {
        // Implementation depends on your business logic
        // Here we just delete the entry from the recycle bin
        deleteByAnnouncementId(announcementId);
    }
    
    @Override
    public void deleteByAnnouncementId(Long announcementId) {
        LambdaQueryWrapper<AnnouncementRecycleBin> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(AnnouncementRecycleBin::getAnnouncementId, announcementId);
        recycleBinMapper.delete(wrapper);
    }
} 