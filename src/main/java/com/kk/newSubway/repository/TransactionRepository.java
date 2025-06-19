package com.kk.newSubway.repository;

import com.kk.newSubway.model.Transaction;
import com.kk.newSubway.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUser_UserId(Long userId);
}