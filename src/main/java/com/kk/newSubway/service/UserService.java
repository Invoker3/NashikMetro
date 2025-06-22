package com.kk.newSubway.service;

import com.kk.newSubway.dto.*;
import com.kk.newSubway.model.Ticket;
import com.kk.newSubway.model.Transaction;
import com.kk.newSubway.model.User;
import com.kk.newSubway.repository.TicketRepository;
import com.kk.newSubway.repository.TransactionRepository;
import com.kk.newSubway.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TransactionRepository transactionRepository;
    private final TicketRepository ticketRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       TransactionRepository transactionRepository, TicketRepository ticketRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.transactionRepository = transactionRepository;
        this.ticketRepository = ticketRepository;
    }

    public ResponseEntity<?> registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists!");
        }
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

        Double amount = addBalanceRequest.getAmount();

        if (amount == null || amount <= 0) {
            return ResponseEntity.badRequest().body("Amount must be greater than 0.");
        }

        //need to write this snippet more efficiently
        User user = userRepository.findById(addBalanceRequest.getUserId()).orElse(null);
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

        if (user.getBalance() < 5) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Insufficient balance. Please add funds.");
        }

        user.setBalance(user.getBalance() - 5); //Fare fee temporarily £5
        //need station IDs to calculate fare amount
        userRepository.save(user);

        LocalDateTime time = LocalDateTime.now();
        // Log transaction
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setAmount(5D);  //Fare fee temporarily £5
        transaction.setType("PURCHASED TICKET");
        transaction.setTimestamp(time);
        transactionRepository.save(transaction);

        Ticket journeyTicket = new Ticket();
        journeyTicket.setUser(user);
        journeyTicket.setTimestamp(time);
        journeyTicket.setStartStationId(ticket.getStartStationId());
        journeyTicket.setEndStationId(ticket.getEndStationId());
        ticketRepository.save(journeyTicket);

        return ResponseEntity.status(HttpStatus.OK).body(new TicketPurchaseConfirmationDTO(
                transaction.getTransactionId(),
                ticket.getStartStationId(),
                ticket.getEndStationId(),
                time));
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user != null && passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthResponse("Login Successful!", user.getUserId(), user.getBalance());
        }
        return new AuthResponse("Invalid email or password", 0L, 0D);
    }


}
