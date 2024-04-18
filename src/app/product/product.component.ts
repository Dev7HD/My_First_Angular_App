import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Product} from "../../model/product.model";
import {ProductsService} from "../services/products.service";
import {Router} from "@angular/router";
import {AppStateService} from "../services/app-state.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit{
 constructor(private productServices: ProductsService,
             private router: Router,
             public appState: AppStateService) {

 }

  ngOnInit() {
    this.getProducts(this.appState.productState.keyword, this.appState.productState.thisPage, this.appState.productState.size)
 }


  getProducts(keyword: string, page: number, size: number){
   this.productServices.getProducts(keyword,page, size).subscribe(
     {
       next: response => {
         this.appState.productState.thisPage = page;
         this.appState.productState.products = response.body as Product[]; // Use non-null assertion for clarity
         if(!this.appState.productState.products.length) {
           this.appState.productState.thisPage --;
           if(this.appState.productState.thisPage <= 0) this.appState.productState.products = []
           else this.getProducts(this.appState.productState.keyword, this.appState.productState.thisPage, this.appState.productState.size);
         }
         this.appState.countAllProducts()

         this.appState.productState.totalCurrentProducts = parseInt(response.headers.get('X-Total-Count') || '0'); // Default to 0 if header is missing
         this.appState.productState.totalSearchPages = Math.ceil(this.appState.productState.totalCurrentProducts / size);
         this.appState.productState.pagesArray = Array.from({ length: this.appState.productState.totalSearchPages }, (_, i) => i + 1);
       },
       error: err => {
         console.error(err.message())
       }
     })
 }

  dispoToggle(product: Product) {
    this.productServices.dispoToggle(product)
      .subscribe({
        next: updatedProduct => {
          const productIndex: number = this.appState.productState.products.findIndex(p => p.id === updatedProduct.id);
          if (productIndex !== -1) {
            this.appState.productState.products[productIndex] = updatedProduct;
            this.appState.countAllProducts()
          }
        },
        error: err => {
          console.error(err);
        }
      });
  }

  selectionToggle(product: Product) {
    this.productServices.selectionToggle(product)
      .subscribe({
        next: updatedProduct => {
          const productIndex = this.appState.productState.products.findIndex(p => p.id === updatedProduct.id);
          if (productIndex !== -1) {
            this.appState.productState.products[productIndex] = updatedProduct;
            this.appState.countAllProducts()
          }
        },
        error: err => {
          console.error(err);
        }
      });
  }

  deleteProduct() {
    if (this.appState.productState.selectedProduct) {
      this.productServices.deleteProduct(this.appState.productState.selectedProduct)
        .subscribe({
          next: () => {
            this.appState.countAllProducts()
            this.getProducts(this.appState.productState.keyword,this.appState.productState.thisPage,this.appState.productState.size)
            this.appState.productState.selectedProduct = null; // Clear selected product after deletion
          },
          error: err => {
            console.error(err.message);
          }
        });
    }
  }


  setProduct(product: Product) {
    if(product != null) {
      this.appState.productState.selectedProduct = product;
    }
  }

  handelUpdate(product: Product) {
    this.router.navigateByUrl(`/edit/${product.id}`)
  }
}
