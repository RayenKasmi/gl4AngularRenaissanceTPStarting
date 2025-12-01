import { Component, OnInit, inject, signal } from '@angular/core';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APP_ROUTES } from '../../../config/routes.config';
import { AuthService } from '../../auth/services/auth.service';

import { DefaultImagePipe } from '../pipes/default-image.pipe';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, map, tap } from 'rxjs';

@Component({
    selector: 'app-details-cv',
    templateUrl: './details-cv.component.html',
    styleUrls: ['./details-cv.component.css'],
    standalone: true,
    imports: [DefaultImagePipe],
})
export class DetailsCvComponent {
  private cvService = inject(CvService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  authService = inject(AuthService);

  private cvId = toSignal(
    this.activatedRoute.params.pipe(
      map(params => +params['id'] || 0)
    ),
    { initialValue: 0 }
  );


  cvResource = rxResource<Cv | null, number>({
    request: () => this.cvId(), // resource refetches when cvId changes
    
    loader: ({ request: id }) => {
      if (!id || id === 0) {
        this.router.navigate([APP_ROUTES.cv]);
        return EMPTY; 
      }
      return this.cvService.getCvById(id).pipe(
          catchError((error) => {
          this.toastr.error('CV introuvable');
          this.router.navigate([APP_ROUTES.cv]);
          return EMPTY;
        })
      );
    },
  });

  cv = this.cvResource.value;
  
  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);
  constructor() {}

  deleteCv(cv: Cv) {
    // still uses subscribe since it's not data fetching but an action
    this.cvService.deleteCvById(cv.id).subscribe({
      next: () => {
        this.toastr.success(`${cv.name} supprimé avec succès`);
        this.router.navigate([APP_ROUTES.cv]);
      },
      error: () => {
        this.toastr.error(
          `Problème avec le serveur veuillez contacter l'admin`
        );
      },
    });
  }
}
