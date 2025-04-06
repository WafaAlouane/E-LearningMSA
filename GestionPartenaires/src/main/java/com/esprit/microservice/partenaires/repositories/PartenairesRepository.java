package com.esprit.microservice.partenaires.repositories;

import com.esprit.microservice.partenaires.entities.Partenaires;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PartenairesRepository extends JpaRepository<Partenaires,Long> {
    List<Partenaires> findByNomContainingIgnoreCase(String nom);
    List<Partenaires> findByIsActive(boolean isActive);


}
