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
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketTypeService {

    private final UserRepository userRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final TicketRepository ticketRepository;
    private final QrCodeService qrCodeService;


    @Transactional
    public void purchaseTicket(UUID userId, UUID ticketTypeId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(
                        String.format("User with ID %s was not found", userId)
                ));

        TicketType ticketType = ticketTypeRepository.findByIdWithLock(ticketTypeId)
                .orElseThrow(() -> new TicketTypeNotFoundException(
                        String.format("Ticket type with ID %s was not found", ticketTypeId)
                ));

        int purchasedTickets = ticketRepository.countByTicketTypeId(ticketTypeId);
        Integer totalAvailable = ticketType.getTotalAvailable();

        if (purchasedTickets + 1 > totalAvailable) {
            throw new TicketsSoldOutException();
        }

        Ticket ticket = new Ticket();
        ticket.setStatus(TicketStatus.PURCHASED);
        ticket.setTicketType(ticketType);
        ticket.setPurchaser(user);
        Ticket savedTicket = ticketRepository.save(ticket);
        qrCodeService.generateQrCode(savedTicket);
        ticketRepository.save(savedTicket);
    }
}
