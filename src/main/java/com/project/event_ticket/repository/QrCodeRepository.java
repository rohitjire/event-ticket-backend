package com.project.event_ticket.repository;

import com.project.event_ticket.domain.entity.QrCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface QrCodeRepository extends JpaRepository<QrCode, UUID> {
}
