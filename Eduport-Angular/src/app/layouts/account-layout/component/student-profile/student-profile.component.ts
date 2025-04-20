import { Component, OnInit } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './student-profile.component.html',
  styles: ``,
})
export class StudentProfileComponent implements OnInit {
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
