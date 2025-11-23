import { Component } from "@angular/core";
import {
  BehaviorSubject,
  Observable,
  concatMap,
  map,
  takeWhile,
  scan,
} from "rxjs";
import { Product } from "./dto/product.dto";
import { ProductService } from "./services/product.service";
import { Settings } from "./dto/product-settings.dto";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent {
  /* Todo : Faire le nécessaire pour créer le flux des produits à afficher */
  /* Tips : vous pouvez voir les différents imports non utilisés et vous en inspirer */
  products$!: Observable<Product[]>;
  private load$ = new BehaviorSubject<number>(0) ;
  private limit = 12;

  constructor(private productService: ProductService) {
    this.products$ = this.load$.pipe(
      concatMap((value) => this.productService.getProducts({limit: this.limit, skip: value*this.limit})),
      takeWhile((value) => value.products.length > 0,true),
      map((value) => value.products),
      scan((acc , products) => [...acc, ...products]),
    )
  }

  loadMore(){
    this.load$.next(this.load$.value + 1);
  }

}
