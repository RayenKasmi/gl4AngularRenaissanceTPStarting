import { Component, inject, OnInit, OnDestroy } from "@angular/core";
import { AbstractControl, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CvService } from "../services/cv.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { APP_ROUTES } from "src/config/routes.config";
import { Cv } from "../model/cv";
import { JsonPipe } from "@angular/common";
import { cinUniqueValidator } from "src/app/cv/validators/cin-unique.validator";
import { cinAgeValidator } from "../validators/cin-age.validator";

@Component({
    selector: "app-add-cv",
    templateUrl: "./add-cv.component.html",
    styleUrls: ["./add-cv.component.css"],
    standalone: true,
    imports: [
    FormsModule,
    ReactiveFormsModule,
    JsonPipe
],
})
// implements onInit to subscribe to age changes and disable/enable image field based on age < 18
// implements onDestroy to persist form data to localStorage for recovery after navigation
export class AddCvComponent implements OnInit, OnDestroy {
  private cvService = inject(CvService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private formBuilder = inject(FormBuilder);

  private readonly STORAGE_KEY = 'addCvFormData';

  constructor() {}

  form = this.formBuilder.group(
    {
      name: ["", Validators.required],
      firstname: ["", Validators.required],
      path: [""],
      job: ["", Validators.required],
      cin: [
        "",
        {
          validators: [Validators.required, Validators.pattern("[0-9]{8}")],
          asyncValidators: [cinUniqueValidator()],
          updateOn: "blur",
        },
      ],
      age:[0, { validators: [Validators.required], updateOn: 'change' }],
    },
    {
      validators: [cinAgeValidator()],
    }
  );

  ngOnInit(): void {
    // check if there's saved form data and restore it
    const savedData = localStorage.getItem(this.STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      this.form.patchValue(parsedData);
    }

    // run initial check in case age was restored from localStorage
    this.checkAgeAndToggleImageField(this.age.value);

    // using takeUntilDestroyed for automatic cleanup when component destroys
    this.age.valueChanges.pipe(takeUntilDestroyed()).subscribe((age) => {
      this.checkAgeAndToggleImageField(age);
    });
  }

  // extracted method to avoid duplication and ensure consistent behavior
  private checkAgeAndToggleImageField(age: number | null): void {
    const imageControl = this.path;
    if (!imageControl) return;

    if (age !== null && age < 18) {
      imageControl.reset();
      imageControl.disable();
    } else {
      imageControl.enable();
    }
  }

  ngOnDestroy(): void {
    // save current form state to localStorage for recovery
    // using getRawValue to include disabled controls
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.form.getRawValue()));
  }

  addCv() {
    this.cvService.addCv(this.form.value as Cv).subscribe({
      next: (cv) => {
        // clear saved form data since submission was successful
        localStorage.removeItem(this.STORAGE_KEY);
        this.router.navigate([APP_ROUTES.cv]);
        this.toastr.success(`Le cv ${cv.firstname} ${cv.name}`);
      },
      error: (err) => {
        this.toastr.error(
          `Une erreur s'est produite, Veuillez contacter l'admin`
        );
      },
    });
  }

  get name(): AbstractControl {
    return this.form.get("name")!;
  }
  get firstname() {
    return this.form.get("firstname");
  }
  get age(): AbstractControl {
    return this.form.get("age")!;
  }
  get job() {
    return this.form.get("job");
  }
  get path() {
    return this.form.get("path");
  }
  get cin(): AbstractControl {
    return this.form.get("cin")!;
  }
}
