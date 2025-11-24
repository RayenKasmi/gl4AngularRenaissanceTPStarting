import { inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { CvService } from '../services/cv.service';

export function cinUniqueValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const cvService = inject(CvService);

    if (!control.value) {
      return of(null);
    }

    return of(control.value).pipe(
      distinctUntilChanged(),
      debounceTime(500), // drops values emitted in less than 500ms and only passes the last one 
      switchMap((cin) =>  
        // it cancels older ongoing async requests. only the latest request is processed. this prevents race conditions
        cvService.selectByProperty('cin', cin).pipe(
          map((cvs) => (cvs.length === 0 ? null : { cinTaken: true })),
          catchError((err) => {
            console.error('Erreur lors de la validation du CIN:', err);
            return of(null);
          })
        )
      )
    );
  };
}