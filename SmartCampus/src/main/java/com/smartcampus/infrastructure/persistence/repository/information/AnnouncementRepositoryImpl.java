package com.smartcampus.infrastructure.persistence.repository.information;

import com.smartcampus.common.enums.information.NotificationStatusEnum;
import com.smartcampus.domain.information.entity.Notification;
import com.smartcampus.domain.information.repository.AnnouncementRepositoryCustom;
import com.smartcampus.infrastructure.persistence.mapper.information.NotificationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 通知公告仓储自定义实现类
 */
@Repository
@RequiredArgsConstructor
public class AnnouncementRepositoryImpl implements AnnouncementRepositoryCustom {

    private final EntityManager entityManager;
    private final NotificationMapper notificationMapper;

    @Override
    public Page<Notification> findByScopeAndStatus(String scope, Integer status, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Notification> query = cb.createQuery(Notification.class);
        Root<Notification> root = query.from(Notification.class);
        
        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.equal(root.get("scope"), scope));
        predicates.add(cb.equal(root.get("status"), status));
        
        query.where(predicates.toArray(new Predicate[0]));
        
        TypedQuery<Notification> typedQuery = entityManager.createQuery(query);
        int totalRows = typedQuery.getResultList().size();
        
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());
        
        List<Notification> result = typedQuery.getResultList();
        
        return new PageImpl<>(result, pageable, totalRows);
    }

    @Override
    public Page<Notification> findByScopeAndType(String scope, Integer type, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Notification> query = cb.createQuery(Notification.class);
        Root<Notification> root = query.from(Notification.class);
        
        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.equal(root.get("scope"), scope));
        predicates.add(cb.equal(root.get("type"), String.valueOf(type)));
        
        query.where(predicates.toArray(new Predicate[0]));
        
        TypedQuery<Notification> typedQuery = entityManager.createQuery(query);
        int totalRows = typedQuery.getResultList().size();
        
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());
        
        List<Notification> result = typedQuery.getResultList();
        
        return new PageImpl<>(result, pageable, totalRows);
    }

    @Override
    public Page<Notification> findByScopeAndImportance(String scope, Integer importance, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Notification> query = cb.createQuery(Notification.class);
        Root<Notification> root = query.from(Notification.class);
        
        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.equal(root.get("scope"), scope));
        predicates.add(cb.equal(root.get("importance"), String.valueOf(importance)));
        
        query.where(predicates.toArray(new Predicate[0]));
        
        TypedQuery<Notification> typedQuery = entityManager.createQuery(query);
        int totalRows = typedQuery.getResultList().size();
        
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());
        
        List<Notification> result = typedQuery.getResultList();
        
        return new PageImpl<>(result, pageable, totalRows);
    }

    @Override
    public List<Notification> findByScopeAndStatusNot(String scope, Integer status) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Notification> query = cb.createQuery(Notification.class);
        Root<Notification> root = query.from(Notification.class);
        
        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.equal(root.get("scope"), scope));
        predicates.add(cb.notEqual(root.get("status"), status));
        
        query.where(predicates.toArray(new Predicate[0]));
        
        return entityManager.createQuery(query).getResultList();
    }

    @Override
    public long countByScopeAndStatusNot(String scope, Integer status) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> query = cb.createQuery(Long.class);
        Root<Notification> root = query.from(Notification.class);
        
        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.equal(root.get("scope"), scope));
        predicates.add(cb.notEqual(root.get("status"), status));
        
        query.select(cb.count(root)).where(predicates.toArray(new Predicate[0]));
        
        return entityManager.createQuery(query).getSingleResult();
    }

    @Override
    public int updateStatus(Long id, Integer status) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        javax.persistence.criteria.CriteriaUpdate<Notification> update = cb.createCriteriaUpdate(Notification.class);
        Root<Notification> root = update.from(Notification.class);
        
        update.set("status", status);
        update.set("updateTime", LocalDateTime.now());
        update.where(cb.equal(root.get("id"), id));
        
        return entityManager.createQuery(update).executeUpdate();
    }

    @Override
    public List<Notification> findByStatus(Integer status) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Notification> query = cb.createQuery(Notification.class);
        Root<Notification> root = query.from(Notification.class);
        
        query.where(cb.equal(root.get("status"), status));
        
        return entityManager.createQuery(query).getResultList();
    }

    @Override
    public List<Notification> findByStatus(NotificationStatusEnum status) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Notification> query = cb.createQuery(Notification.class);
        Root<Notification> root = query.from(Notification.class);
        
        query.where(cb.equal(root.get("status"), status));
        
        return entityManager.createQuery(query).getResultList();
    }

    @Override
    public Page<Notification> findByStatusAndIsPinned(NotificationStatusEnum status, Boolean isPinned, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Notification> query = cb.createQuery(Notification.class);
        Root<Notification> root = query.from(Notification.class);
        
        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.equal(root.get("status"), status));
        predicates.add(cb.equal(root.get("isPinned"), isPinned));
        
        query.where(predicates.toArray(new Predicate[0]));
        
        TypedQuery<Notification> typedQuery = entityManager.createQuery(query);
        int totalRows = typedQuery.getResultList().size();
        
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());
        
        List<Notification> result = typedQuery.getResultList();
        
        return new PageImpl<>(result, pageable, totalRows);
    }

    @Override
    public Page<Notification> findByCreatorIdAndStatus(String creatorId, NotificationStatusEnum status, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Notification> query = cb.createQuery(Notification.class);
        Root<Notification> root = query.from(Notification.class);
        
        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.equal(root.get("creatorId"), creatorId));
        predicates.add(cb.equal(root.get("status"), status));
        
        query.where(predicates.toArray(new Predicate[0]));
        
        TypedQuery<Notification> typedQuery = entityManager.createQuery(query);
        int totalRows = typedQuery.getResultList().size();
        
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());
        
        List<Notification> result = typedQuery.getResultList();
        
        return new PageImpl<>(result, pageable, totalRows);
    }

    @Override
    public Page<Notification> findByScopeAndStatus(String scope, NotificationStatusEnum status, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Notification> query = cb.createQuery(Notification.class);
        Root<Notification> root = query.from(Notification.class);
        
        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.equal(root.get("scope"), scope));
        predicates.add(cb.equal(root.get("status"), status));
        
        query.where(predicates.toArray(new Predicate[0]));
        
        TypedQuery<Notification> typedQuery = entityManager.createQuery(query);
        int totalRows = typedQuery.getResultList().size();
        
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());
        
        List<Notification> result = typedQuery.getResultList();
        
        return new PageImpl<>(result, pageable, totalRows);
    }

    @Override
    public List<Notification> findByStatusAndExpireTimeBefore(NotificationStatusEnum status, LocalDateTime expireTime) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Notification> query = cb.createQuery(Notification.class);
        Root<Notification> root = query.from(Notification.class);
        
        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.equal(root.get("status"), status));
        predicates.add(cb.lessThan(root.get("expireTime"), expireTime));
        
        query.where(predicates.toArray(new Predicate[0]));
        
        return entityManager.createQuery(query).getResultList();
    }

    @Override
    public List<Notification> findByStatusAndScheduledPublishTimeLessThanEqual(NotificationStatusEnum status, LocalDateTime now) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Notification> query = cb.createQuery(Notification.class);
        Root<Notification> root = query.from(Notification.class);
        
        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.equal(root.get("status"), status));
        predicates.add(cb.lessThanOrEqualTo(root.get("scheduledPublishTime"), now));
        
        query.where(predicates.toArray(new Predicate[0]));
        
        return entityManager.createQuery(query).getResultList();
    }

    @Override
    public int updateStatus(Long id, NotificationStatusEnum status, LocalDateTime updateTime) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        javax.persistence.criteria.CriteriaUpdate<Notification> update = cb.createCriteriaUpdate(Notification.class);
        Root<Notification> root = update.from(Notification.class);
        
        update.set("status", status);
        update.set("updateTime", updateTime);
        update.where(cb.equal(root.get("id"), id));
        
        return entityManager.createQuery(update).executeUpdate();
    }

    @Override
    public List<Notification> findByStatusAndArchiveTimeBefore(NotificationStatusEnum status, LocalDateTime archiveTime) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Notification> query = cb.createQuery(Notification.class);
        Root<Notification> root = query.from(Notification.class);
        
        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.equal(root.get("status"), status));
        predicates.add(cb.lessThan(root.get("archiveTime"), archiveTime));
        
        query.where(predicates.toArray(new Predicate[0]));
        
        return entityManager.createQuery(query).getResultList();
    }

    @Override
    public List<Notification> findByStatusAndUpdateTimeBefore(NotificationStatusEnum status, LocalDateTime deleteTime) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Notification> query = cb.createQuery(Notification.class);
        Root<Notification> root = query.from(Notification.class);
        
        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.equal(root.get("status"), status));
        predicates.add(cb.lessThan(root.get("updateTime"), deleteTime));
        
        query.where(predicates.toArray(new Predicate[0]));
        
        return entityManager.createQuery(query).getResultList();
    }

    @Override
    public Page<Notification> findByTypeAndStatus(String type, NotificationStatusEnum status, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Notification> query = cb.createQuery(Notification.class);
        Root<Notification> root = query.from(Notification.class);
        
        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.equal(root.get("type"), type));
        predicates.add(cb.equal(root.get("status"), status));
        
        query.where(predicates.toArray(new Predicate[0]));
        
        TypedQuery<Notification> typedQuery = entityManager.createQuery(query);
        int totalRows = typedQuery.getResultList().size();
        
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());
        
        List<Notification> result = typedQuery.getResultList();
        
        return new PageImpl<>(result, pageable, totalRows);
    }
} 