package com.project.event_ticket.repository;

import com.project.event_ticket.domain.entity.TicketValidation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TicketValidationRepository extends JpaRepository<TicketValidation, UUID> {

}
