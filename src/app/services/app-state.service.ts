import { Injectable } from '@angular/core';
import {Product} from "../../model/product.model";
import {ProductState} from "../../model/product-state.model";
import {ProductsService} from "./products.service";

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  public productState: ProductState = {
    products:  [],
    allProducts: [],
    keyword: "",
    size: 5,
    thisPage: 1,
    totalPages: 0,
    totalSearchPages: 0,
    pagesArray: [],
    totalCountProducts: 0,
    totalCurrentProducts: 0,
    selectedProduct: null,
    totalAvailable: 0,
    totalSelected: 0
  }

  constructor(private productServices: ProductsService) { }



  public getAllProducts(){
    this.productServices.getAllProducts().subscribe({
      next: products => {
        let allProducts = products
        let totalCountProducts = products.length
        let totalPages = Math.ceil(this.productState.totalCountProducts / this.productState.size)
        let totalSelected = products.filter(p => p.selected).length
        let totalAvailable = products.filter(p => p.available).length

        this.setState({
          allProducts,
          totalCountProducts,
          totalPages,
          totalSelected,
          totalAvailable
        })
      }, error: err => {
        console.error("Error getting total products count:", err);
      }
    })
  }

  public setState(state: any) {
    this.productState = {...this.productState, ...state}
  }

  public updateOneProduct(index: number, updatedProduct: Product) {
    this.productState.products[index] = updatedProduct;
    let productIndex = this.productState.allProducts.findIndex(p => p.id == updatedProduct.id)
    this.productState.allProducts[productIndex] = updatedProduct
    let totalSelected = this.productState.allProducts.filter(p => p.selected).length
    let totalAvailable = this.productState.allProducts.filter(p => p.available).length
    this.setState({
      totalSelected: totalSelected,
      totalAvailable: totalAvailable
    })
  }

}
