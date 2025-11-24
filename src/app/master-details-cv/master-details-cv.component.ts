import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CvService } from '../cv/services/cv.service';
import { Cv } from '../cv/model/cv';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { ListComponent } from '../cv/list/list.component';
import { DetailsCvComponent } from '../cv/details-cv/details-cv.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-master-details-cv',
  templateUrl: './master-details-cv.component.html',
  styleUrls: ['./master-details-cv.component.css'],
  standalone: true,
  imports: [CommonModule, ListComponent, DetailsCvComponent, DatePipe, UpperCasePipe],
})
export class MasterDetailsCvComponent implements OnInit {
  private cvService = inject(CvService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toastr = inject(ToastrService);

  cvs = signal<Cv[]>([]);
  selectedCv = this.cvService.selectedCv;
  date = new Date();

  constructor() {}

  ngOnInit() {
    // Load CVs list
    this.cvService.getCvs().subscribe({
      next: (cvs) => {
        this.cvs.set(cvs);
      },
      error: () => {
        this.cvs.set(this.cvService.getFakeCvs());
        this.toastr.error(`
          Attention!! Les données sont fictives, problème avec le serveur.
          Veuillez contacter l'admin.`);
      },
    });

    // get cv id from yrl
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        const id = +params['id'];
        this.cvService.getCvById(id).subscribe({
          next: (cv) => {
            this.cvService.selectCv(cv);
          },
          error: () => {
            this.toastr.error('CV non trouvé');
          },
        });
      }
    });
  }

  onCvSelected(cv: Cv) {
    this.router.navigate(['/list', cv.id]);
  }
}
