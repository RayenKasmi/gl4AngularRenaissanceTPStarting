import { Component } from "@angular/core";
import { Cv } from "../model/cv";
import { LoggerService } from "../../services/logger.service";
import { ToastrService } from "ngx-toastr";
import { CvService } from "../services/cv.service";
import { Observable, of } from "rxjs";
import { catchError, startWith } from "rxjs/operators";
@Component({
  selector: "app-cv",
  templateUrl: "./cv.component.html",
  styleUrls: ["./cv.component.css"],
})
export class CvComponent {
  cvs$: Observable<Cv[]> = this.cvService.getCvs().pipe(
    catchError(() => {
      this.toastr.error(`
          Attention!! Les données sont fictives, problème avec le serveur.
          Veuillez contacter l'admin.`);
      // Fallbackk
      return of(this.cvService.getFakeCvs());
    })
  );

  selectedCv$: Observable<Cv | null> = this.cvService.selectCv$.pipe(
    startWith(null)
  );
  date = new Date();

  constructor(
    private logger: LoggerService,
    private toastr: ToastrService,
    private cvService: CvService
  ) {
    this.logger.logger("je suis le cvComponent");
    this.toastr.info("Bienvenu dans notre CvTech");
  }
}
