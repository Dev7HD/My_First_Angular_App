import {Injectable, OnInit} from '@angular/core';
import {Product} from "../../model/product.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor( private http : HttpClient) { }

  public getProducts(keyword: string, page: number, size: number) {
    return this.http.get(`${environment.json_host}Products?name_like=${keyword}&_page=${page}&_limit=${size}`,{observe:'response'})
  }

  public dispoToggle(product: Product): Observable<Product> {
    return this.http.patch<Product>(`${environment.json_host}Products/${product.id}`,{
      available: !product.available
    })
  }

  public selectionToggle(product: Product): Observable<Product> {
    return this.http.patch<Product>(`${environment.json_host}Products/${product.id}`,{
      selected: !product.selected
    })
  }

  public deleteProduct(product: Product) {
    return this.http.delete(`${environment.json_host}Products/${product.id}`)
  }

  public saveProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${environment.json_host}Products/`,product)
  }
}
