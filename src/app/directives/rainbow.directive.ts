import { Directive, ElementRef, HostBinding, HostListener, signal } from '@angular/core';

@Directive({
  selector: 'input[appRainbow][type=text],texetarea',
  standalone: true, 
})
export class RainbowDirective {
  private colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
  private colorSignal = signal(this.colors[0]);

  @HostBinding('style.color')
  @HostBinding('style.borderColor')
  get color() {
    return this.colorSignal();
  }

  @HostListener('keyup')
  onKeyUp() {
    // Only work on input elements

      const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
      this.colorSignal.set(randomColor);
  }
}
