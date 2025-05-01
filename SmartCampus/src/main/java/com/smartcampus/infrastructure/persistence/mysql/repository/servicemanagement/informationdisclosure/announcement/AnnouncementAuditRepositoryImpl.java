package com.smartcampus.infrastructure.persistence.mysql.repository.servicemanagement.informationdisclosure.announcement;

import com.smartcampus.domain.servicemanagement.informationdisclosure.entity.announcement.AnnouncementAudit;
import com.smartcampus.domain.servicemanagement.informationdisclosure.repository.announcement.AnnouncementAuditRepository;
import com.smartcampus.infrastructure.persistence.mysql.mapper.servicemanagement.informationdisclosure.announcement.AnnouncementAuditMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AnnouncementAuditRepositoryImpl implements AnnouncementAuditRepository {
    @Autowired
    private AnnouncementAuditMapper auditMapper;
    
    @Override
    public void save(AnnouncementAudit audit) {
        if (audit.getId() == null) {
            auditMapper.insert(audit);
        } else {
            auditMapper.updateById(audit);
        }
    }
    
    @Override
    public List<AnnouncementAudit> findByAnnouncementId(Long announcementId) {
        return auditMapper.selectByAnnouncementId(announcementId);
    }
} 