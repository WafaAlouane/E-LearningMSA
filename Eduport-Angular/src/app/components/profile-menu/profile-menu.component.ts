import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '@/app/core/service/auth-service.service';
import {
  storageThemeKey,
  ThemeModeService,
} from '@/app/core/service/theme-mode.service';
import { logout } from '@/app/store/authentication/authentication.actions';
import { Store } from '@ngrx/store';
import { RouterLink } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile-menu',
  standalone: true,
  imports: [NgbDropdownModule, RouterLink],
  templateUrl: './profile-menu.component.html',
  styles: ``,
})
export class ProfileMenuComponent implements OnInit {
  // Informations de l'utilisateur
  user: any;

  // Gestion du thème
  preferredTheme: string = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
  getTheme = localStorage.getItem(storageThemeKey);
  mode: string = this.getTheme ? this.getTheme : this.preferredTheme;

  // Injection des services
  public themeModeService = inject(ThemeModeService);
  public store = inject(Store);
  public authService = inject(AuthService);

  ngOnInit(): void {
    // Récupérer les informations de l'utilisateur depuis le localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
  }

  // Changer le thème
  changeTheme(mode: 'light' | 'dark' | 'auto') {
    this.mode = mode;
    this.themeModeService.updateTheme(mode);
  }

  // Déconnexion
  logout(): void {
    localStorage.removeItem('user'); // Supprimer les données de l'utilisateur
    localStorage.removeItem('accessToken'); // Supprimer le token d'accès
    // Rediriger vers la page de connexion
    window.location.href = '/login';
  }
}