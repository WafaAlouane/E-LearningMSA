import { Component, OnInit } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-instructor-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './instructor-profile.component.html',
  styles: ``,
})
export class InstructorProfileComponent implements OnInit{
  user: any; // Objet pour stocker les informations de l'utilisateur

  constructor() {}

  ngOnInit(): void {
    // Récupérer les informations de l'utilisateur depuis le localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData); // Convertir la chaîne JSON en objet
    }
  }
}
