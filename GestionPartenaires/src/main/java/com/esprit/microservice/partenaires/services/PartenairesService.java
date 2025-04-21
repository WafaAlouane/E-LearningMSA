package com.esprit.microservice.partenaires.services;

import com.esprit.microservice.partenaires.entities.Partenaires;
import com.esprit.microservice.partenaires.repositories.PartenairesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PartenairesService {

    @Autowired
    private PartenairesRepository partenairesRepository;
    public Partenaires save(Partenaires p) {
        return partenairesRepository.save(p);
    }

    public List<Partenaires> getAll() {
        return partenairesRepository.findAll();
    }

    public Partenaires getPartnerById(Long id) {
        return partenairesRepository.findById(id).orElseThrow(() -> new RuntimeException("Partenaire non trouvé"));
    }

    public Partenaires update(Long id, Partenaires updatedPartner) {
        // Vérifie si l'entité avec cet ID existe
        if (!partenairesRepository.existsById(id)) {
            throw new RuntimeException("Partenaire avec l'ID " + id + " non trouvé");
        }

        // Met à jour l'ID du partenaire reçu pour s'assurer qu'il correspond à l'entité existante
        updatedPartner.setId(id);

        // Enregistre et retourne l'entité mise à jour
        return partenairesRepository.save(updatedPartner);
    }


    public boolean delete(Long id) {
        if (partenairesRepository.existsById(id)) {
            partenairesRepository.deleteById(id);
            return true;
        }
        return false;
    }
    public List<Partenaires> searchByName(String name) {
        return partenairesRepository.findByNomContainingIgnoreCase(name);
    }
    public List<Partenaires> getAllSorted(String field, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(field).descending() : Sort.by(field).ascending();
        return partenairesRepository.findAll(sort);
    }
    public List<Partenaires> getPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Partenaires> partenairesPage = partenairesRepository.findAll(pageable);
        return partenairesPage.getContent();
    }

    public Partenaires toggleActivation(Long id, boolean active) {
        Partenaires partenaire = partenairesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partenaire introuvable"));

        partenaire.setActive(active);
        return partenairesRepository.save(partenaire);
    }

    public List<Partenaires> getByActivationStatus(boolean isActive) {
        return partenairesRepository.findByIsActive(isActive);
    }

}
