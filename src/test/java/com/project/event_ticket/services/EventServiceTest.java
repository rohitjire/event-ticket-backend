package com.project.event_ticket.services;

import com.project.event_ticket.domain.entity.Event;
import com.project.event_ticket.domain.entity.User;
import com.project.event_ticket.domain.enums.EventStatus;
import com.project.event_ticket.domain.requests.CreateEventRequest;
import com.project.event_ticket.domain.requests.CreateTicketTypeRequest;
import com.project.event_ticket.exceptions.UserNotFoundException;
import com.project.event_ticket.repository.EventRepository;
import com.project.event_ticket.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private EventService eventService;

    @Test
    void createEvent_shouldCreateEvent_whenOrganizerExists() {
        UUID organizerId = UUID.randomUUID();
        User organizer = new User();
        organizer.setId(organizerId);
        organizer.setName("Test Organizer");

        CreateTicketTypeRequest ticketTypeRequest = new CreateTicketTypeRequest();
        ticketTypeRequest.setName("General");
        ticketTypeRequest.setPrice(25.0);
        ticketTypeRequest.setTotalAvailable(100);

        CreateEventRequest request = new CreateEventRequest();
        request.setName("Test Event");
        request.setVenue("Test Venue");
        request.setStatus(EventStatus.DRAFT);
        request.setStart(LocalDateTime.now().plusDays(30));
        request.setEnd(LocalDateTime.now().plusDays(30).plusHours(3));
        request.setTicketTypes(List.of(ticketTypeRequest));

        Event savedEvent = new Event();
        savedEvent.setId(UUID.randomUUID());
        savedEvent.setName("Test Event");

        when(userRepository.findById(organizerId)).thenReturn(Optional.of(organizer));
        when(eventRepository.save(any(Event.class))).thenReturn(savedEvent);

        Event result = eventService.createEvent(organizerId, request);

        assertNotNull(result);
        assertEquals("Test Event", result.getName());
        verify(eventRepository).save(any(Event.class));
    }

    @Test
    void createEvent_shouldThrow_whenOrganizerNotFound() {
        UUID organizerId = UUID.randomUUID();
        CreateEventRequest request = new CreateEventRequest();
        request.setTicketTypes(List.of());

        when(userRepository.findById(organizerId)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class,
                () -> eventService.createEvent(organizerId, request));
    }

    @Test
    void listEventsForOrganizer_shouldReturnOnlyOrganizerEvents() {
        UUID organizerId = UUID.randomUUID();
        PageRequest pageable = PageRequest.of(0, 10);

        Event event = new Event();
        event.setId(UUID.randomUUID());
        event.setName("Organizer's Event");

        Page<Event> page = new PageImpl<>(List.of(event));
        when(eventRepository.findByOrganizerId(organizerId, pageable)).thenReturn(page);

        Page<Event> result = eventService.listEventsForOrganizer(organizerId, pageable);

        assertEquals(1, result.getTotalElements());
        assertEquals("Organizer's Event", result.getContent().get(0).getName());
    }

    @Test
    void listPublishedEvents_shouldReturnOnlyPublishedEvents() {
        PageRequest pageable = PageRequest.of(0, 10);

        Event event = new Event();
        event.setId(UUID.randomUUID());
        event.setStatus(EventStatus.PUBLISHED);

        Page<Event> page = new PageImpl<>(List.of(event));
        when(eventRepository.findByStatus(EventStatus.PUBLISHED, pageable)).thenReturn(page);

        Page<Event> result = eventService.listPublishedEvents(pageable);

        assertEquals(1, result.getTotalElements());
        assertEquals(EventStatus.PUBLISHED, result.getContent().get(0).getStatus());
    }
}
