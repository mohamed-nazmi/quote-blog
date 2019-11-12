import { AbstractControl, ValidationErrors } from '@angular/forms';

export class SignupValidators {
    static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
        if ((control.value as string).indexOf(' ') >= 0) {
            return { containsSpace: true };
        }
        return null;
    }

    static mustStartWithLetter(control: AbstractControl): ValidationErrors | null {
        const input = control.value as string;
        if (input.length > 0) {
            const firstChar = input.charAt(0).toUpperCase();
            if (!(firstChar >= 'A' && firstChar <= 'Z')) {
                return { firstCharNotLetter: true };
            }
        }
        return null;
    }
}
