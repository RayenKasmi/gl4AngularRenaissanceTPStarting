import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appRainbow]'
})
export class RainbowDirective {
  private colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

  @HostBinding('style.color') textColor = this.colors[0];
  @HostBinding('style.borderColor') borderColor = this.colors[0];

  constructor(private el: ElementRef) {
    if (this.el.nativeElement.tagName !== 'INPUT') {
      return;
    }
  }

  @HostListener('keyup')
  onKeyUp() {
    // Only work on input elements
    if (this.el.nativeElement.tagName === 'INPUT') {
      const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
      this.textColor = randomColor;
      this.borderColor = randomColor;
    }
  }
}
