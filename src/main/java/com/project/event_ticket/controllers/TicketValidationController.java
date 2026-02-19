package com.project.event_ticket.controllers;

import com.project.event_ticket.domain.dtos.TicketValidationRequestDto;
import com.project.event_ticket.domain.dtos.TicketValidationResponseDto;
import com.project.event_ticket.domain.entity.TicketValidation;
import com.project.event_ticket.domain.enums.TicketValidationMethod;
import com.project.event_ticket.mappers.TicketValidationMapper;
import com.project.event_ticket.services.TicketValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/v1/ticket-validations")
@RequiredArgsConstructor
public class TicketValidationController {

    private final TicketValidationService ticketValidationService;
    private final TicketValidationMapper ticketValidationMapper;

    @PostMapping
    public ResponseEntity<TicketValidationResponseDto> validateTicket(
            @RequestBody TicketValidationRequestDto ticketValidationRequestDto) {
        TicketValidationMethod method = ticketValidationRequestDto.getMethod();
        TicketValidation ticketValidation;
        if (TicketValidationMethod.MANUAL.equals(method)) {
            ticketValidation = ticketValidationService.validateTicketManually(ticketValidationRequestDto.getId());
        } else {
            ticketValidation = ticketValidationService.validateTicketByQrCode(ticketValidationRequestDto.getId());
        }
        return ResponseEntity.ok(ticketValidationMapper.toTicketValidationResponseDto(ticketValidation));
    }
}
