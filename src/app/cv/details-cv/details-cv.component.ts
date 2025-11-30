import { Component, OnInit, computed, inject, resource } from "@angular/core";
import { Cv } from "../model/cv";
import { CvService } from "../services/cv.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { APP_ROUTES } from "../../../config/routes.config";
import { AuthService } from "../../auth/services/auth.service";

import { DefaultImagePipe } from "../pipes/default-image.pipe";
import { firstValueFrom } from "rxjs";

@Component({
    selector: "app-details-cv",
    templateUrl: "./details-cv.component.html",
    styleUrls: ["./details-cv.component.css"],
    standalone: true,
    imports: [DefaultImagePipe],
})
export class DetailsCvComponent implements OnInit {
  private cvService = inject(CvService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  authService = inject(AuthService);

  // Resource API used to fetch a single CV by id; exposes a signal-based value.
  private cvResource = resource<Cv | null, void>({
    loader: async () => {
      const id = +this.activatedRoute.snapshot.params["id"];
      try {
        return await firstValueFrom(this.cvService.getCvById(id));
      } catch {
        this.router.navigate([APP_ROUTES.cv]);
        return null;
      }
    },
  });

  // Derived signal used directly by the template.
  cv = computed<Cv | null>(() => this.cvResource.value() ?? null);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);
  constructor() {}

  ngOnInit() {}

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
