package com.project.event_ticket.repository;

import com.project.event_ticket.domain.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, UUID> {

}
