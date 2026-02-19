package com.project.event_ticket.repository;

import com.project.event_ticket.domain.entity.QrCode;
import com.project.event_ticket.domain.enums.QrCodeStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface QrCodeRepository extends JpaRepository<QrCode, UUID> {

    Optional<QrCode> findByTicketIdAndTicketPurchaserId(UUID ticketId, UUID ticketPurchaseId);

    Optional<QrCode> findByIdAndStatus(UUID qrCodeId, QrCodeStatus qrCodeStatus);
}
