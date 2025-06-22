package com.kk.newSubway.controller;

import com.kk.newSubway.dto.AddBalanceToUserAccount;
import com.kk.newSubway.dto.AuthResponse;
import com.kk.newSubway.dto.LoginRequest;
import com.kk.newSubway.dto.PurchaseTicketDTO;
import com.kk.newSubway.model.User;
import com.kk.newSubway.service.TicketService;
import com.kk.newSubway.service.TransactionService;
import com.kk.newSubway.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final TransactionService transactionService;
    private final TicketService ticketService;

    @Autowired
    public UserController(UserService userService, TransactionService transactionService, TicketService ticketService) {
        this.userService = userService;
        this.transactionService = transactionService;
        this.ticketService = ticketService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) { return userService.registerUser(user); }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() { return userService.getAllUsers(); }

    @PostMapping("/add-balance")
    public ResponseEntity<?> addBalance(@RequestBody AddBalanceToUserAccount addBalanceRequest) { return userService.addBalance(addBalanceRequest); }

    @GetMapping("/{userId}/balance")
    public ResponseEntity<?> getBalance(@PathVariable Long userId) { return userService.getBalance(userId); }

    @PostMapping("/purchase-ticket")
    public ResponseEntity<?> purchaseTicket(@RequestBody PurchaseTicketDTO ticket) { return userService.purchaseTicket(ticket); }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) { return userService.login(request); }

    @GetMapping("/{userId}/getTransactions")
    public ResponseEntity<?> getUserTransactions(@PathVariable Long userId) { return ResponseEntity.ok().body(transactionService.getTransactionByUserId(userId)); }

    @GetMapping("/{userId}/getTickets")
    public ResponseEntity<?> getUserTickets(@PathVariable Long userId) { return ResponseEntity.ok().body(ticketService.getTicketByUserId(userId)); }

}
