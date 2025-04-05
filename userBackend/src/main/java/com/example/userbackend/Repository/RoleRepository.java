package com.example.userbackend.Repository;

import com.example.userbackend.Entity.Role;
import com.example.userbackend.Enum.ERole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
}
