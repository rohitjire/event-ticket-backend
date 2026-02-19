package com.project.event_ticket.domain.dtos;

import com.project.event_ticket.domain.enums.TicketValidationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketValidationResponseDto {
    private UUID ticketId;
    private TicketValidationStatus status;
}
