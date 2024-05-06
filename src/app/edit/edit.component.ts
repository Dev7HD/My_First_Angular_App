import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductsService} from "../services/products.service";
import {Product} from "../../model/product.model";
import {ActivatedRoute} from "@angular/router";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {AppStateService} from "../services/app-state.service";
import {ToastService} from "../services/toast-service.service";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditProductComponent implements OnInit{
  @ViewChild('toastTemplate') toastTemplate!: TemplateRef<any>;
  @ViewChild('myModalContent') myModalContent: any;

  public productFormGroup!: FormGroup;
  public product!: Product;
  public id!:number;

  constructor(
    private formBuilder: FormBuilder,
    private productServices: ProductsService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private appState: AppStateService,
    protected toastService: ToastService
  ) {
  }


  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id']
    this.productServices.getProductById(this.id).subscribe({
      next: product => {
        this.productFormGroup = this.formBuilder.group({
          id: this.formBuilder.control(product?.id, Validators.required),
          name: this.formBuilder.control(product?.name, [Validators.required, Validators.minLength(3)]),
          price: this.formBuilder.control(product?.price, [Validators.required, Validators.min(0)]),
          quantity: this.formBuilder.control(product?.quantity, [Validators.required, Validators.min(0)]),
          available: this.formBuilder.control(product?.available, Validators.required),
          selected: this.formBuilder.control(product?.selected, Validators.required)
        })
      }, error: err => {
        console.error(err)
        this.showToast(this.toastTemplate, 'Oops, something went wrong!', this.toastService.errorToastClassName);
      }
    })

    }

  showToast(template: TemplateRef<any>, innerText: string, classname: string): void {
    this.toastService.show({ template, text: innerText, classname: classname, delay: 3000 });
  }

  openModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', keyboard: false });
  }

  closeModal() {
    this.modalService.dismissAll()
  }

  editComponent() {
    this.showToast(this.toastTemplate,'Updating product information',this.toastService.standardToastClassName)
    this.product = this.productFormGroup.value;
    this.productServices.updateProduct(this.productFormGroup.value).subscribe({
      next: () => {
        this.appState.getAllProducts()
        this.toastService.clear()
        this.openModal(this.myModalContent)
      }, error: err => {
        console.error(err.message)
        this.showToast(this.toastTemplate, 'Oops, something went wrong!', this.toastService.errorToastClassName);
      }
    })
  }
}
