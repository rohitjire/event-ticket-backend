package com.project.event_ticket.domain.dtos;

import com.project.event_ticket.domain.enums.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetTicketResponseDto {
    private UUID id;
    private TicketStatus status;
    private Double price;
    private String description;
    private String eventName;
    private String eventVenue;
    private LocalDateTime eventStart;
    private LocalDateTime eventEnd;
}
