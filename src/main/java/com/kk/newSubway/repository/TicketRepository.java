package com.kk.newSubway.repository;

import com.kk.newSubway.model.Ticket;
import com.kk.newSubway.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByUser_UserId(Long userId);
}
