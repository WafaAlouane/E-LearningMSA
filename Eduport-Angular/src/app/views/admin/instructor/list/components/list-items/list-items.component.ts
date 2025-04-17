import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../../../../UserFrontEnd/service/user.service'; // Importez le service

@Component({
  selector: 'list-items',
  standalone: true,
  imports: [DecimalPipe, NgbTooltipModule],
  templateUrl: './list-items.component.html',
  styles: ``,
})
export class ListItemsComponent implements OnInit {
  instructors: any[] = []; // Remplacez par la liste des utilisateurs

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Charger les utilisateurs depuis l'API
  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.instructors = data; // Mettre à jour la liste des utilisateurs
      },
      (error) => {
        console.error('Erreur lors du chargement des utilisateurs', error);
      }
    );
  }

  // Supprimer un utilisateur
  deleteUser(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(id).subscribe(
        () => {
          this.loadUsers(); // Recharger la liste après suppression
        },
        (error) => {
          console.error('Erreur lors de la suppression', error);
        }
      );
    }
  }
}