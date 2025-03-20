package com.kk.newSubway.service;

import com.kk.newSubway.dto.AddBalanceToUserAccount;
import com.kk.newSubway.dto.PurchaseTicketDTO;
import com.kk.newSubway.model.Ticket;
import com.kk.newSubway.model.Transaction;
import com.kk.newSubway.model.User;
import com.kk.newSubway.repository.TicketRepository;
import com.kk.newSubway.repository.TransactionRepository;
import com.kk.newSubway.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private TicketRepository ticketRepository;

    public ResponseEntity<User> registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    public ResponseEntity<List<User>> getAllUsers() {
        List<User> userList = userRepository.findAll();
        return ResponseEntity.ok(userList);
    }

    @Transactional
    public ResponseEntity<?> addBalance(AddBalanceToUserAccount addBalanceRequest) {

        Long userId = addBalanceRequest.getUserId();
        Double amount = addBalanceRequest.getAmount();

        if (addBalanceRequest.getAmount() == null || addBalanceRequest.getAmount() <= 0) {
            return ResponseEntity.badRequest().body("Amount must be greater than 0.");
        }

        //need to write this snippet more efficiently
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        // Log transaction
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setAmount(amount);
        transaction.setType("ADD");
        transaction.setTimestamp(LocalDateTime.now());
        transactionRepository.save(transaction);

        user.setBalance(user.getBalance() + amount);
        User updatedUser = userRepository.save(user);

        return ResponseEntity.ok(updatedUser);
    }

    public ResponseEntity<?> getBalance(Long userId) {
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        return ResponseEntity.ok(user.getBalance());
    }

    public ResponseEntity<?> purchaseTicket(PurchaseTicketDTO ticket) {
        User user = userRepository.findById(ticket.getUserId()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        user.setBalance(user.getBalance() - 5); //Fare fee temporarily £5
        //need station IDs to calculate fare amount
        userRepository.save(user);

        // Log transaction
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setAmount(5D);  //Fare fee temporarily £5
        transaction.setType("DEDUCT");
        transaction.setTimestamp(LocalDateTime.now());
        transactionRepository.save(transaction);

        Ticket journeyTicket = new Ticket();
        journeyTicket.setUser(user);
        journeyTicket.setTimestamp(LocalDateTime.now());
        journeyTicket.setStartStationId(ticket.getStartStationId());
        journeyTicket.setEndStationId(ticket.getEndStationId());
        ticketRepository.save(journeyTicket);

        return ResponseEntity.status(HttpStatus.OK).body("Ticket purchased successfully.");
    }




}
