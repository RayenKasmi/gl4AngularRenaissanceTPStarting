import { Component } from '@angular/core';
import { RainbowDirective } from '../directives/rainbow.directive';

@Component({
  selector: 'app-rainbow',
  template: `
    <div class="container mt-4">
      <h2>Rainbow Text Simulator</h2>
      <p>Type in the input below to see rainbow colors:</p>
      <input
        type="text"
        class="form-control"
        appRainbow
        placeholder="Type here to see rainbow colors!">
    </div>
  `,
  styles: [`
    .form-control {
      border: 2px solid #ccc;
      padding: 10px;
      font-size: 16px;
    }
  `],
  standalone: true,
  imports: [RainbowDirective]
})
export class RainbowComponent {}
