package com.project.event_ticket.services;

import com.project.event_ticket.domain.entity.Ticket;
import com.project.event_ticket.repository.TicketRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;

    public Page<Ticket> listTicketsForUser(UUID userId, Pageable pageable) {
        return ticketRepository.findByPurchaserId(userId, pageable);
    }

    public Optional<Ticket> getTicketForUser(UUID userId, UUID ticketId) {
        return ticketRepository.findByIdAndPurchaserId(ticketId, userId);
    }
}
