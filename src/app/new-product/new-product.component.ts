import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Product} from "../../model/product.model";
import {ProductsService} from "../services/products.service";

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css'
})
export class NewProductComponent implements OnInit{

  public productForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private productServices: ProductsService
    ) {
  }

  ngOnInit() {
    this.resetFormControl()
  }

  saveProduct(product: Product) {
    this.productServices.saveProduct(product).subscribe({
      next: value => {
        console.table(product)
        this.resetFormControl()
      }, error: err => {
        console.error(err)
      }
    })
  }


  resetFormControl() {
    this.productForm = this.formBuilder.group({
    name: this.formBuilder.control('', [Validators.required, Validators.minLength(3)]),
    price: this.formBuilder.control(0, [Validators.required, Validators.min(0)]),
    quantity: this.formBuilder.control(0, [Validators.required, Validators.min(0)]),
    available: this.formBuilder.control(false, Validators.required),
    selected: this.formBuilder.control(false, Validators.required)
    })
  }
}
