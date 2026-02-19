package com.project.event_ticket.services;


import com.project.event_ticket.domain.entity.QrCode;
import com.project.event_ticket.domain.entity.Ticket;
import com.project.event_ticket.domain.entity.TicketValidation;
import com.project.event_ticket.domain.enums.QrCodeStatus;
import com.project.event_ticket.domain.enums.TicketValidationMethod;
import com.project.event_ticket.domain.enums.TicketValidationStatus;
import com.project.event_ticket.exceptions.QrCodeNotFoundException;
import com.project.event_ticket.exceptions.TicketNotFoundException;
import com.project.event_ticket.repository.QrCodeRepository;
import com.project.event_ticket.repository.TicketRepository;
import com.project.event_ticket.repository.TicketValidationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class TicketValidationService {

    private final QrCodeRepository qrCodeRepository;
    private final TicketValidationRepository ticketValidationRepository;
    private final TicketRepository ticketRepository;

    public TicketValidation validateTicketByQrCode(UUID qrCodeId) {
        QrCode qrCode = qrCodeRepository.findByIdAndStatus(qrCodeId, QrCodeStatus.ACTIVE)
                .orElseThrow(() ->
                        new QrCodeNotFoundException(String.format("QR Code with ID %s was not found", qrCodeId)));

        Ticket ticket = qrCode.getTicket();

        return validateTicket(ticket, TicketValidationMethod.QR_SCAN);
    }

    public TicketValidation validateTicketManually(UUID ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(TicketNotFoundException::new);
        return validateTicket(ticket, TicketValidationMethod.MANUAL);
    }


    private TicketValidation validateTicket(Ticket ticket, TicketValidationMethod ticketValidationMethod) {
        TicketValidation ticketValidation = new TicketValidation();
        ticketValidation.setTicket(ticket);
        ticketValidation.setValidationMethod(ticketValidationMethod);
        TicketValidationStatus ticketValidationStatus = ticket.getTicketValidations().stream()
                .filter(v -> TicketValidationStatus.VALID.equals(v.getStatus()))
                .findFirst()
                .map(v -> TicketValidationStatus.INVALID)
                .orElse(TicketValidationStatus.VALID);
        ticketValidation.setStatus(ticketValidationStatus);
        return ticketValidationRepository.save(ticketValidation);
    }

}
