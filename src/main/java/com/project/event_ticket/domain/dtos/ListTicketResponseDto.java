package com.project.event_ticket.domain.dtos;

import com.project.event_ticket.domain.enums.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ListTicketResponseDto {
    private UUID id;
    private TicketStatus status;
    private ListTicketTicketTypeResponseDto ticketType;
}
