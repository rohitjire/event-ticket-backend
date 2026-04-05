package com.project.event_ticket.services;

import com.project.event_ticket.domain.entity.Ticket;
import com.project.event_ticket.domain.entity.TicketType;
import com.project.event_ticket.domain.entity.User;
import com.project.event_ticket.domain.enums.TicketStatus;
import com.project.event_ticket.exceptions.TicketTypeNotFoundException;
import com.project.event_ticket.exceptions.TicketsSoldOutException;
import com.project.event_ticket.exceptions.UserNotFoundException;
import com.project.event_ticket.repository.TicketRepository;
import com.project.event_ticket.repository.TicketTypeRepository;
import com.project.event_ticket.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TicketTypeServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private TicketTypeRepository ticketTypeRepository;

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private QrCodeService qrCodeService;

    @InjectMocks
    private TicketTypeService ticketTypeService;

    @Test
    void purchaseTicket_shouldSucceed_whenTicketsAvailable() {
        UUID userId = UUID.randomUUID();
        UUID ticketTypeId = UUID.randomUUID();

        User user = new User();
        user.setId(userId);

        TicketType ticketType = new TicketType();
        ticketType.setId(ticketTypeId);
        ticketType.setTotalAvailable(100);

        Ticket savedTicket = new Ticket();
        savedTicket.setId(UUID.randomUUID());
        savedTicket.setStatus(TicketStatus.PURCHASED);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(ticketTypeRepository.findByIdWithLock(ticketTypeId)).thenReturn(Optional.of(ticketType));
        when(ticketRepository.countByTicketTypeId(ticketTypeId)).thenReturn(0);
        when(ticketRepository.save(any(Ticket.class))).thenReturn(savedTicket);

        assertDoesNotThrow(() -> ticketTypeService.purchaseTicket(userId, ticketTypeId));

        verify(ticketRepository, times(2)).save(any(Ticket.class));
        verify(qrCodeService).generateQrCode(any(Ticket.class));
    }

    @Test
    void purchaseTicket_shouldThrow_whenSoldOut() {
        UUID userId = UUID.randomUUID();
        UUID ticketTypeId = UUID.randomUUID();

        User user = new User();
        user.setId(userId);

        TicketType ticketType = new TicketType();
        ticketType.setId(ticketTypeId);
        ticketType.setTotalAvailable(10);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(ticketTypeRepository.findByIdWithLock(ticketTypeId)).thenReturn(Optional.of(ticketType));
        when(ticketRepository.countByTicketTypeId(ticketTypeId)).thenReturn(10);

        assertThrows(TicketsSoldOutException.class,
                () -> ticketTypeService.purchaseTicket(userId, ticketTypeId));

        verify(ticketRepository, never()).save(any());
    }

    @Test
    void purchaseTicket_shouldThrow_whenUserNotFound() {
        UUID userId = UUID.randomUUID();
        UUID ticketTypeId = UUID.randomUUID();

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class,
                () -> ticketTypeService.purchaseTicket(userId, ticketTypeId));
    }

    @Test
    void purchaseTicket_shouldThrow_whenTicketTypeNotFound() {
        UUID userId = UUID.randomUUID();
        UUID ticketTypeId = UUID.randomUUID();

        User user = new User();
        user.setId(userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(ticketTypeRepository.findByIdWithLock(ticketTypeId)).thenReturn(Optional.empty());

        assertThrows(TicketTypeNotFoundException.class,
                () -> ticketTypeService.purchaseTicket(userId, ticketTypeId));
    }
}
