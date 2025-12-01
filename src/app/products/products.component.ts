import { Component, effect, inject, signal, untracked } from "@angular/core";
import {
  BehaviorSubject,
  Observable,
  concatMap,
  map,
  takeWhile,
  scan,
  EMPTY,
} from "rxjs";
import { Product } from "./dto/product.dto";
import { ProductService } from "./services/product.service";
import { Settings } from "./dto/product-settings.dto";
import { AsyncPipe } from "@angular/common";
import { rxResource, toObservable } from "@angular/core/rxjs-interop";

@Component({
    selector: "app-products",
    templateUrl: "./products.component.html",
    styleUrls: ["./products.component.css"],
    standalone: true,
    imports: [
    AsyncPipe
],
})
export class ProductsComponent {
  /* Todo : Faire le nécessaire pour créer le flux des produits à afficher */
  /* Tips : vous pouvez voir les différents imports non utilisés et vous en inspirer */
  private productService = inject(ProductService);

  
  private limit = 12;

  load = signal(0);
  stopLoading = signal(false);
  
  productResourceRequest = rxResource(
    {
      request: () => {
        if (this.stopLoading()) return undefined; 
        return {
          limit: this.limit,
          skip: this.load() * this.limit,
        };
      },
    loader: ({ request }) =>{
      if (!request) return EMPTY;
      return this.productService.getProducts({limit: request.limit, skip: request.skip}).pipe(
        map(response => {
            if (response.products.length + request.skip >= response.total) {
              this.stopLoading.set(true);
            }
            return response.products;
          }
        ),
        scan((acc, value) => [...acc, ...value]),
      )}
    }
  )

  constructor() {
}

  loadMore() {
    if (!this.productResourceRequest.isLoading()) { // could add && !this.stopLoading() in the condition but i wanted to screw with the rxresource itslef to block it
      this.load.update(value => value + 1);
    }
  }
  
 /*
  // works great
  products$!: Observable<Product[]>;
  private load$ = new BehaviorSubject<number>(0) ;
  private limit = 12;

  productResourceRequest = rxResource(
    {loader: () => this.products$}
  )

  constructor() {
    this.products$ = this.load$.pipe(
      concatMap((value) => this.productService.getProducts({limit: this.limit, skip: value*this.limit})),
      takeWhile((value) => value.total > value.skip + value.products.length, true), //prevents any unescacary get request since inclusive = true 
      map((value) => value.products),
      scan((acc , products) => [...acc, ...products]),
    )
  }

  loadMore(){
    this.load$.next(this.load$.value + 1);
  }*/
    /*
  private limit = 12;

  load = signal(0);
  
  productResourceRequest = rxResource(
    {
    loader: () =>{
      return toObservable(this.load).pipe(concatMap((value) => this.productService.getProducts({limit: this.limit, skip: value*this.limit})),

        takeWhile((response) => response.products.length + response.skip < response.total, true),
        map(response => {
            return response.products;
          }
        ),
        scan((acc, value) => [...acc, ...value]),
      )
    }
    }
  )

  constructor() {
}

  loadMore() {
    if (!this.productResourceRequest.isLoading()) { // could add && !this.stopLoading() in the condition but i wanted to screw with the rxresource itslef to block it
      this.load.update(value => value + 1);
    }
  }*/
}

