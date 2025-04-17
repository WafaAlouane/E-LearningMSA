import {
  ApplicationConfig,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withInMemoryScrolling,
  type InMemoryScrollingFeature,
  type InMemoryScrollingOptions,
} from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { AuthInterceptor } from './UserFrontEnd/authHelpers/AuthInterceptor';
import { provideEffects } from '@ngrx/effects';
import { AuthenticationEffects } from './store/authentication/authentication.effects';
import { provideStore } from '@ngrx/store';
import { rootReducer } from './store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideNgxStripe } from 'ngx-stripe';
import { SubscriptionService } from '../../src/app/UserFrontEnd/service/subscription.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';

// Scroll
const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};

const inMemoryScrollingFeature: InMemoryScrollingFeature =
  withInMemoryScrolling(scrollConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    provideNgxStripe('pk_test_51RC0ytIxjlAz4X2AoC08dzpUzAjPZJ14OLqJcUZW9Dje1n6dWj7cNT0o4nrjioXJMWrw6FQm3jbZa8UMwrLhW9tA00gwiotQCi'),
    // Interceptors
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    
    // Stripe configuration (utilisant la clé publique du service)
    provideNgxStripe(SubscriptionService.stripePublicKey),
    
    // Angular core providers
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, inMemoryScrollingFeature),
    
    // NgRx providers
    provideStore(rootReducer),
    provideEffects(AuthenticationEffects),
    
    // HTTP client
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    
    // Dev tools
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    
    // Animations
    provideAnimations(),

    

    MatSnackBarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatCheckboxModule
  ],
};