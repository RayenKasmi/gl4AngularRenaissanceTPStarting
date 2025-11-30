import { Component, computed, inject, resource } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Cv } from "../cv/model/cv";
import { CvService } from "../cv/services/cv.service";
import { ListComponent } from "../cv/list/list.component";
import { CvCardComponent } from "../cv/cv-card/cv-card.component";
import { ToastrService } from "ngx-toastr";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-master-details-cv",
  standalone: true,
  templateUrl: "./master-details-cv.component.html",
  imports: [CommonModule, ListComponent, CvCardComponent],
})
export class MasterDetailsCvComponent {
  private cvService = inject(CvService);
  private toastr = inject(ToastrService);

  // Resource API used to fetch CVs for the master list.
  cvsResource = resource<Cv[], void>({
    loader: async () => {
      try {
        return await firstValueFrom(this.cvService.getCvs());
      } catch {
        this.toastr.error(`
          Attention!! Les données sont fictives, problème avec le serveur.
          Veuillez contacter l'admin.`);
        return this.cvService.getFakeCvs();
      }
    },
  });

  // Derived signal used by the template for the list.
  cvs = computed<Cv[]>(() => this.cvsResource.value() || []);

  // Selected CV signal comes from the shared CvService.
  selectedCv = this.cvService.selectedCv;
}


