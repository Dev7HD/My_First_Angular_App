import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Product} from "../../model/product.model";
import {ProductsService} from "../services/products.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {AppStateService} from "../services/app-state.service";

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css'
})
export class NewProductComponent implements OnInit{
  @ViewChild('myModalContent') myModalContent: any;

  public productForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private productServices: ProductsService,
    private modalService: NgbModal,
    private appState: AppStateService
    ) {
  }

  ngOnInit() {
    this.resetFormControl()
  }

  openModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', keyboard: false });
  }

  closeModal() {
    this.modalService.dismissAll()
  }

  saveProduct(product: Product) {
    this.productServices.saveProduct(product).subscribe({
      next: () => {
        this.appState.countAllProducts()
        this.openModal(this.myModalContent)
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
