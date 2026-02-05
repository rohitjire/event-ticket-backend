package com.project.event_ticket.repository;

import com.project.event_ticket.domain.entity.TicketType;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface TicketTypeRepository extends JpaRepository<TicketType, UUID> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT tt FROM TicketType tt WHERE tt.id = :id")
    Optional<TicketType> findByIdWithLock(@Param("id") UUID id);
}
