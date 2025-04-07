package com.example.eventesb.repositories;

import com.example.eventesb.entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    @Query("SELECT e FROM Event e WHERE " +
            "(:name IS NULL OR e.name LIKE %:name%) AND " +
            "(:location IS NULL OR e.location LIKE %:location%) AND " +
            "(:startDate IS NULL OR e.dateTime >= :startDate) AND " +
            "(:endDate IS NULL OR e.dateTime <= :endDate)")
    List<Event> findEventsByCriteria(
            @Param("name") String name,
            @Param("location") String location,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}
