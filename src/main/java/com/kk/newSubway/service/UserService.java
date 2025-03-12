package com.kk.newSubway.service;

import com.kk.newSubway.model.Transaction;
import com.kk.newSubway.model.User;
import com.kk.newSubway.repository.TransactionRepository;
import com.kk.newSubway.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User addBalance(Long userId, Double amount) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setBalance(user.getBalance() + amount);
        userRepository.save(user);

        // Log transaction
        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setAmount(amount);
        transaction.setType("ADD");
        transaction.setTimestamp(LocalDateTime.now());
        transactionRepository.save(transaction);

        return user;
    }

    public Double getBalance(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return user.getBalance();
    }

    public User deductFare(Long userId, Double fare) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getBalance() < fare) {
            throw new RuntimeException("Insufficient balance");
        }
        user.setBalance(user.getBalance() - fare);
        userRepository.save(user);

        // Log transaction
        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setAmount(fare);
        transaction.setType("DEDUCT");
        transaction.setTimestamp(LocalDateTime.now());
        transactionRepository.save(transaction);

        return user;
    }




}
