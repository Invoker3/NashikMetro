package com.kk.newSubway.repository;

import com.kk.newSubway.model.TravelLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TravelLogRepository extends JpaRepository<TravelLog, Long> {
}
