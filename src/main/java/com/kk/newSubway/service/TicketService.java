package com.kk.newSubway.service;

import com.kk.newSubway.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public ResponseEntity<?> getAllTickets() {
        return ResponseEntity.ok(ticketRepository.findAll());
    }

    public ResponseEntity<?> getTicketByUserId(Long userId) {
        return ResponseEntity.ok(ticketRepository.findByUser_UserId(userId));
    }
}
