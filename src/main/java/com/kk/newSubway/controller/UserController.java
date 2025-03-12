package com.kk.newSubway.controller;

import com.kk.newSubway.model.User;
import com.kk.newSubway.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/{userId}/add-balance")
    public User addBalance(@PathVariable Long userId, @RequestParam Double amount) {
        return userService.addBalance(userId, amount);
    }

    @GetMapping("/{userId}/balance")
    public Double getBalance(@PathVariable Long userId) {
        return userService.getBalance(userId);
    }

    @PostMapping("/{userId}/deduct-fare")
    public User deductFare(@PathVariable Long userId, @RequestParam Double fare) {
        return userService.deductFare(userId, fare);
    }
}
