import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ttc',
  templateUrl: './ttc.component.html',
  styleUrls: ['./ttc.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class TtcComponent {
  // Input signals with default values
  priceHT = signal(0);
  quantity = signal(1);
  tva = signal(18);

  // Computed values
  discountRate = computed(() => {
    const qty = this.quantity();
    if (qty >= 10 && qty <= 15) return 0.20; // 20% discount
    if (qty > 15) return 0.30; // 30% discount
    return 0; // No discount
  });

  baseTotal = computed(() => {
    return this.priceHT() * this.quantity();
  });

  discountAmount = computed(() => {
    return this.baseTotal() * this.discountRate();
  });

  priceAfterDiscount = computed(() => {
    return this.baseTotal() - this.discountAmount();
  });

  priceTTC = computed(() => {
    const tvaRate = this.tva() / 100;
    return this.priceAfterDiscount() * (1 + tvaRate);
  });

  unitPriceTTC = computed(() => {
    return this.quantity() > 0 ? this.priceTTC() / this.quantity() : 0;
  });
}
