import { Component, OnInit, inject, signal, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APP_ROUTES } from '../../../config/routes.config';
import { AuthService } from '../../auth/services/auth.service';

import { DefaultImagePipe } from '../pipes/default-image.pipe';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-details-cv',
    templateUrl: './details-cv.component.html',
    styleUrls: ['./details-cv.component.css'],
    standalone: true,
    imports: [DefaultImagePipe, CommonModule],
})
export class DetailsCvComponent implements OnInit, OnChanges {
  private cvService = inject(CvService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  authService = inject(AuthService);

  @Input() cv: Cv | null = null;
  cvSignal = signal<Cv | null>(null);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);
  constructor() {}

  ngOnInit() {
    if (this.cv) {
      this.cvSignal.set(this.cv);
    } else {
      //load from route
      const id = this.activatedRoute.snapshot.params['id'];
      if (id) {
        this.cvService.getCvById(+id).subscribe({
          next: (cv) => {
            this.cvSignal.set(cv);
          },
          error: () => {
            this.router.navigate([APP_ROUTES.cv]);
          },
        });
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    //update cvsignal when cv input change
    if (changes['cv'] && changes['cv'].currentValue) {
      this.cvSignal.set(changes['cv'].currentValue);
    }
  }

  deleteCv(cv: Cv) {
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
