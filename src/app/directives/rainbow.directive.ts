import { Directive, ElementRef, HostBinding, HostListener, signal } from '@angular/core';

@Directive({
  selector: '[appRainbow]',
  standalone: true
})
export class RainbowDirective {
  private colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
  private colorSignal = signal(this.colors[0]);

  @HostBinding('style.color')
  @HostBinding('style.borderColor')
  get color() {
    return this.colorSignal();
  }

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
      this.colorSignal.set(randomColor);
    }
  }
}
