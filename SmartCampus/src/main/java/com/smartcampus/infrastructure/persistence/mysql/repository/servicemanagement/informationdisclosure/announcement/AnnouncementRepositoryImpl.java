package com.smartcampus.infrastructure.persistence.mysql.repository.servicemanagement.informationdisclosure.announcement;

import com.smartcampus.domain.servicemanagement.informationdisclosure.entity.announcement.Announcement;
import com.smartcampus.domain.servicemanagement.informationdisclosure.repository.announcement.AnnouncementRepository;
import com.smartcampus.infrastructure.persistence.mysql.mapper.servicemanagement.informationdisclosure.announcement.AnnouncementMapper;
import org.springframework.stereotype.Repository;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

/**
 * 通知公告仓储实现
 */
@Repository
@RequiredArgsConstructor
public class AnnouncementRepositoryImpl implements AnnouncementRepository {

    private final AnnouncementMapper announcementMapper;

    @Override
    public Optional<Announcement> findById(Long id) {
        return Optional.ofNullable(announcementMapper.selectById(id));
    }

    @Override
    public Announcement save(Announcement announcement) {
        if (announcement.getId() == null) {
            announcementMapper.insert(announcement);
        } else {
            announcementMapper.updateById(announcement);
        }
        return announcement;
    }

    @Override
    public void deleteById(Long id) {
        announcementMapper.deleteById(id);
    }

    // Implement other custom methods defined in the interface
}
