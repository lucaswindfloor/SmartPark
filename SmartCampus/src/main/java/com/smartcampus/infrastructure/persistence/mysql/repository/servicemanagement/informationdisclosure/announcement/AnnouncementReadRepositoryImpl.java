package com.smartcampus.infrastructure.persistence.mysql.repository.servicemanagement.informationdisclosure.announcement;

import com.smartcampus.domain.servicemanagement.informationdisclosure.entity.announcement.AnnouncementRead;
import com.smartcampus.domain.servicemanagement.informationdisclosure.repository.announcement.AnnouncementReadRepository;
import com.smartcampus.infrastructure.persistence.mysql.mapper.servicemanagement.informationdisclosure.announcement.AnnouncementReadMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AnnouncementReadRepositoryImpl implements AnnouncementReadRepository {
    @Autowired
    private AnnouncementReadMapper readMapper;
    
    @Override
    public void save(AnnouncementRead read) {
        if (read.getId() == null) {
            readMapper.insert(read);
        } else {
            readMapper.updateById(read);
        }
    }
    
    @Override
    public List<AnnouncementRead> findByAnnouncementId(Long announcementId) {
        return readMapper.selectByAnnouncementId(announcementId);
    }
    
    @Override
    public AnnouncementRead findByAnnouncementIdAndUsername(Long announcementId, String username) {
        return readMapper.selectByAnnouncementIdAndUsername(announcementId, username);
    }
    
    @Override
    public int countByAnnouncementId(Long announcementId) {
        return readMapper.countByAnnouncementId(announcementId);
    }
} 