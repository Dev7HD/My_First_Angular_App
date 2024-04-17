import {Component, OnInit} from '@angular/core';
import {Product} from "../../model/product.model";
import {ProductsService} from "../services/products.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit{
 constructor(private productServices: ProductsService, private router: Router) {

 }

  public products: Array<Product> = [];
  public keyword: string = "";
  public size: number = 5;
  public page: number = 1;
  public thisPage: number = 1;
  public totalPages: number = 1;
  public pagesArray: number[] = []
  public totalCountProducts: number = 0;
  public selectedProduct!: Product | null;

  ngOnInit() {
    this.getProducts(this.keyword, this.thisPage, this.size)
 }

  getProducts(keyword: string, page: number, size: number){
   this.productServices.getProducts(keyword,page, size).subscribe(
     {
       next: response => {
         this.thisPage = page;
         this.products = response.body as Product[]; // Use non-null assertion for clarity
         if(!this.products.length) {
           this.thisPage --;
           if(this.thisPage <= 0) this.products = []
           else this.getProducts(this.keyword, this.thisPage, this.size);
         }
         this.totalCountProducts = parseInt(response.headers.get('X-Total-Count') || '0'); // Default to 0 if header is missing
         this.totalPages = Math.ceil(this.totalCountProducts / size);
         if(this.page == 1) {
           this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
         }
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
          const productIndex: number = this.products.findIndex(p => p.id === updatedProduct.id);
          if (productIndex !== -1) {
            this.products[productIndex] = updatedProduct;
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
          const productIndex = this.products.findIndex(p => p.id === updatedProduct.id);
          if (productIndex !== -1) {
            this.products[productIndex] = updatedProduct;
          }
        },
        error: err => {
          console.error(err);
        }
      });
  }

  deleteProduct() {
    if (this.selectedProduct) {
      this.productServices.deleteProduct(this.selectedProduct)
        .subscribe({
          next: () => {
            this.getProducts(this.keyword,this.thisPage,this.size)
            this.selectedProduct = null; // Clear selected product after deletion
          },
          error: err => {
            console.error(err.message);
          }
        });
    }
  }


  setProduct(product: Product) {
    if(product != null) {
      this.selectedProduct = product;
    }
  }

  handelUpdate(product: Product) {
    this.router.navigateByUrl(`/edit/${product.id}`)
  }
}
