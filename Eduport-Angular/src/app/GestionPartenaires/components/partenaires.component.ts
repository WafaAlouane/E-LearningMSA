import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PartenairesService } from '../service/partenaires.service';
import { Partenaire } from '../models/Partenaire';
import { MaterialModule } from '@/app/material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-partenaire',
  templateUrl: './partenaires.component.html',
  styleUrls: [],
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // Correction des erreurs `formGroup`
    RouterModule,
  ]
})
export class PartenaireComponent implements OnInit {
  partenaireForm!: FormGroup;
  partenaires: Partenaire[] = [];
  submitted = false;
  message = '';
  isError = false;

  constructor(private partenaireService: PartenairesService, private fb: FormBuilder) {
    this.partenaireForm = this.fb.group({
      nom: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      isActive: [false],
    });
  }

  ngOnInit(): void {
    this.loadPartenaires();
  }

  /** 🔹 Récupérer tous les partenaires */
  loadPartenaires() {
    this.partenaireService.getAllPartenaires().subscribe({
      next: (data: Partenaire[]) => {
        this.partenaires = data;
      },
      error: (error) => {
        console.error('Erreur de chargement des partenaires', error);
      },
    });
  }

  /** 🔹 Ajouter un partenaire */
  onSubmit(): void {
    this.submitted = true;

    if (this.partenaireForm.invalid) {
      this.message = 'Veuillez remplir tous les champs obligatoires.';
      this.isError = true;
      return;
    }

    this.partenaireService.createPartenaire(this.partenaireForm.value).subscribe({
      next: () => {
        this.message = 'Partenaire ajouté avec succès!';
        this.isError = false;
        this.loadPartenaires();
      },
      error: (error) => {
        console.error('Erreur lors de l’ajout du partenaire', error);
        this.message = error.error?.message || 'Erreur lors de l’ajout.';
        this.isError = true;
      },
    });
  }

  /** 🔹 Supprimer un partenaire */
  deletePartenaire(id: number) {
    this.partenaireService.deletePartenaire(id).subscribe({
      next: () => {
        this.message = 'Partenaire supprimé avec succès!';
        this.isError = false;
        this.loadPartenaires();
      },
      error: (error) => {
        console.error('Erreur de suppression', error);
        this.message = 'Erreur lors de la suppression.';
        this.isError = true;
      },
    });
  }

  /** 🔹 Modifier un partenaire */
  updatePartenaire(id: number, partenaire: Partenaire) {
    this.partenaireService.updatePartenaire(id, partenaire).subscribe({
      next: () => {
        this.message = 'Partenaire mis à jour avec succès!';
        this.isError = false;
        this.loadPartenaires();
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour', error);
        this.message = 'Erreur lors de la mise à jour.';
        this.isError = true;
      },
    });
  }

  toggleActivation(id: number, active: boolean) {
    this.partenaireService.toggleActivation(id, active).subscribe({
      next: (updatedPartenaire: Partenaire) => {
        // Update the `isActive` status in the `partenaires` list
        const index = this.partenaires.findIndex(p => p.id === id);
        if (index !== -1) {
          this.partenaires[index] = updatedPartenaire; // Replace the old object with the updated one
        }
        this.message = `Partenaire ${active ? 'activé' : 'désactivé'} avec succès!`;
        this.isError = false;
      },
      error: (error) => {
        console.error('Erreur lors du changement de statut', error);
        this.message = 'Erreur lors du changement de statut.';
        this.isError = true;
      },
    });
  }



  /** 🔹 Rechercher un partenaire par nom */
  searchPartenaireByName(name: string) {
    this.partenaireService.searchPartenaireByName(name).subscribe({
      next: (data: Partenaire[]) => {
        this.partenaires = data;
      },
      error: (error) => {
        console.error('Erreur de recherche', error);
        this.message = 'Erreur lors de la recherche.';
        this.isError = true;
      },
    });
  }

  sortPartenaires(field: string, direction: string) {
    this.partenaireService.getSortedPartenaires(field, direction).subscribe({
      next: (data: Partenaire[]) => {
        this.partenaires = data;
        this.message = `Partenaires triés par ${field} (${direction}).`;
        this.isError = false;
      },
      error: (error) => {
        console.error('Erreur lors du tri des partenaires:', error);
        this.message = 'Erreur lors du tri.';
        this.isError = true;
      },
    });
  }
 // Search method for input change
 onInputChange(event: Event) {
  const inputValue = (event.target as HTMLInputElement).value;
  this.searchPartenaire(inputValue); // Call your search method
}

searchPartenaire(name: string) {
  if (!name.trim()) {
    this.loadPartenaires(); // Reload all partners if input is empty
    return;
  }

  this.partenaireService.searchPartenaireByName(name).subscribe({
    next: (data: Partenaire[]) => {
      this.partenaires = data;
      this.message = `Résultats pour "${name}".`;
      this.isError = false;
    },
    error: (error) => {
      console.error('Erreur lors de la recherche:', error);
      this.message = 'Erreur lors de la recherche.';
      this.isError = true;
    },
  });
}
loadPaginatedPartenaires(page: number, size: number) {
  this.partenaireService.getPaginatedPartenaires(page, size).subscribe({
    next: (data: Partenaire[]) => {
      this.partenaires = data;
      this.message = `Page ${page + 1} chargée avec succès.`;
      this.isError = false;
    },
    error: (error) => {
      console.error('Erreur lors de la pagination:', error);
      this.message = 'Erreur lors de la pagination.';
      this.isError = true;
    },
  });
}
currentPage = 0;
pageSize = 10;

goToNextPage() {
  this.currentPage++;
  this.loadPaginatedPartenaires(this.currentPage, this.pageSize);
}

goToPreviousPage() {
  if (this.currentPage > 0) {
    this.currentPage--;
    this.loadPaginatedPartenaires(this.currentPage, this.pageSize);
  }
}


}
