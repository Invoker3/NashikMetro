package com.kk.newSubway.repository;

import com.kk.newSubway.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}