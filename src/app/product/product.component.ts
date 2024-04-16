import {Component, OnInit} from '@angular/core';
import {Product} from "../../model/product.model";
import {ProductsService} from "../services/products.service";
import {HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit{
 constructor(private productServices: ProductsService) {

 }

  public products: Array<Product> = [];
  public keyword: string = "";
  public size: number = 5;
  public page: number = 1;
  public thisPage: number = 1;
  public totalPages: number = 1;
  public pagesArray: number[] = []
  public totalCountProducts: number = 0;

  ngOnInit() {
    this.getProducts(this.keyword, this.thisPage, this.size)
 }

  getProducts(keyword: string, page: number, size: number){
   this.productServices.getProducts(keyword,page, size).subscribe(
     {
       next: response => {
         this.products = response.body as Product[]
         this.thisPage = page;
         const xTotalCountHeader = response.headers.get('X-Total-Count')
         this.totalCountProducts = xTotalCountHeader != null ? parseInt(xTotalCountHeader) : 0
         this.totalPages = this.totalCountProducts % size ? this.totalCountProducts / size + 1: this.totalCountProducts / size
         if(this.page == 1) {
           this.pagesArray = []
           for(let i = 1; i <= this.totalPages; i++){
             this.pagesArray.push(i)
           }
         }
       },
       error: err => {
         console.error(err.message())
       }
     })
 }

  dispoToggle(product: Product) {
    this.productServices.dispoToggle(product).subscribe({
      next: updatedProduct => {
        product.available = !product.available
      }, error: err => {
        console.error(err.message)
      }
    })
  }

  selectionToggle(product: Product) {
    this.productServices.selectionToggle(product).subscribe({
      next: updatedProduct => {
        product.selected = !product.selected
      }, error: err => {
        console.error(err.message)
      }
    })
  }
  selectedProduct!: Product;
  setProduct(product: Product) {
    this.selectedProduct = product;
  }

  deleteProduct() {
    this.productServices.deleteProduct(this.selectedProduct).subscribe({
      next: data => {
        this.getProducts(this.keyword, this.thisPage, this.size)
      }
    })
  }

}
