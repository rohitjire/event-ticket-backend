package com.project.event_ticket.mappers;

import com.project.event_ticket.domain.dtos.CreateEventRequestDto;
import com.project.event_ticket.domain.dtos.CreateEventResponseDto;
import com.project.event_ticket.domain.dtos.CreateTicketTypeRequestDto;
import com.project.event_ticket.domain.entity.Event;
import com.project.event_ticket.domain.requests.CreateEventRequest;
import com.project.event_ticket.domain.requests.CreateTicketTypeRequest;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EventMapper {

    CreateTicketTypeRequest fromDto(CreateTicketTypeRequestDto dto);

    CreateEventRequest fromDto(CreateEventRequestDto dto);

    CreateEventResponseDto toDto(Event event);
}
