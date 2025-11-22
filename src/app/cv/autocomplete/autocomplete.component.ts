import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, AbstractControl } from "@angular/forms";
import { debounceTime, distinctUntilChanged, switchMap, startWith, catchError, of, Observable } from "rxjs";
import { CvService } from "../services/cv.service";
import { Cv } from "../model/cv";

@Component({
  selector: "app-autocomplete",
  templateUrl: "./autocomplete.component.html",
  styleUrls: ["./autocomplete.component.css"],
})
export class AutocompleteComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  cvService = inject(CvService);
  
  form = this.formBuilder.group({ search: [""] });
  filteredCvs$!: Observable<Cv[]>;
  
  get search(): AbstractControl {
    return this.form.get("search")!;
  }

  ngOnInit(): void {
    this.filteredCvs$ = this.search.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchTerm: string) => {
        if (!searchTerm || searchTerm.trim() === '') {
          return this.cvService.getCvs();
        }
        return this.cvService.selectByName(searchTerm.trim());
      }),
      catchError(() => of([]))
    );
  }

  onSelectCv(cv: Cv): void {
    this.cvService.selectCv(cv);
  }
}
