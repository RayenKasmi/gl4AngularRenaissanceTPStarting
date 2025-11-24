import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

export function cinAgeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    
    const cinControl = control.get('cin');
    const ageControl = control.get('age');

    if(!cinControl || !ageControl) {
        return null;
    }

    const cin = cinControl.value;
    const age = ageControl.value;

    if (!age || !cin) {
      return null;
    }

    const firstTwoDigits = parseInt(cin.substring(0, 2), 10);

    if(age >= 60){
        if(firstTwoDigits <0 || firstTwoDigits > 19) { return { cinAgeMismatch: true}; }
    }
    else {
        if(firstTwoDigits <=19) { return { cinAgeMismatch: true}; }
    }
    return null;
  };
}