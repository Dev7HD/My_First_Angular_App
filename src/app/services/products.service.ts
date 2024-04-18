import {Injectable} from '@angular/core';
import {Product} from "../../model/product.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor( private http : HttpClient) { }
    public getProducts(keyword: string, page: number, size: number) {
    return this.http.get(`${environment.json_host}Products?name_like=${keyword}&_page=${page}&_limit=${size}`,{observe:'response'})
  }

  public updateFieldProduct(product: Product, field: string): Observable<Product> {
    return this.http.patch<Product>(`${environment.json_host}Products/${product.id}`, field === 'available' ? {
      available: !product.available
    } : field === 'selected' ? { selected: !product.selected } : {id: product.id})
  }

  public deleteProduct(product: Product) {
    return this.http.delete(`${environment.json_host}Products/${product.id}`)
  }

  public saveProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${environment.json_host}Products/`,product)
  }

  public updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${environment.json_host}Products/${product.id}`,product)
  }

  getProductById(id: number): Observable<Product>{
    return this.http.get<Product>(`${environment.json_host}Products/${id}`)
  }

  getAllProducts(): Observable<Product[]>{
    return this.http.get<Product[]>(`${environment.json_host}Products/`)
  }
}
