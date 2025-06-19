package com.kk.newSubway.service;

import com.kk.newSubway.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class TransactionService {

    @Autowired
    TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public ResponseEntity<?> getAllTransactions() {
        return ResponseEntity.ok(transactionRepository.findAll());
    }

    public ResponseEntity<?> getTransactionByUserId(Long userId) {
        return ResponseEntity.ok(transactionRepository.findByUser_UserId(userId));
    }
}
