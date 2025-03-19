package com.kk.newSubway.controller;

import com.kk.newSubway.dto.AddBalanceToUserAccount;
import com.kk.newSubway.model.User;
import com.kk.newSubway.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/add-balance")
    public ResponseEntity<?> addBalance(@RequestBody AddBalanceToUserAccount addBalanceRequest) {
        return userService.addBalance(addBalanceRequest);
    }

    @GetMapping("/{userId}/balance")
    public ResponseEntity<?> getBalance(@PathVariable Long userId) {
        return userService.getBalance(userId);
    }

//    @PostMapping("/deduct-fare")
//    public ResponseEntity<?> deductFare(@RequestBody DeductFare deductRequest) {
//        return userService.deductFare(deductRequest);
//    }

    @PostMapping("/buy-ticket")
    public ResponseEntity<?> buyTicket(@RequestBody AddBalanceToUserAccount addBalanceRequest) {
        return userService.addBalance(addBalanceRequest);
    }
}
