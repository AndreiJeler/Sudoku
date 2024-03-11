import { Directive, HostListener } from '@angular/core';

@Directive({ standalone: true, selector: '[sudokuRestrictOneDigit]' })
export class OneDigitDirective {
  @HostListener('input', ['$event'])
  onInputChange(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Keep only the first digit if the input is longer.
    if (value.length > 0) {
      input.value = value.slice(0, 1);
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
