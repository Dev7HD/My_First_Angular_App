import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Product} from "../../model/product.model";
import {ProductsService} from "../services/products.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {AppStateService} from "../services/app-state.service";
import {ToastService} from "../services/toast-service.service";

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css'
})
export class NewProductComponent implements OnInit{
  @ViewChild('myModalContent') myModalContent: any;
  @ViewChild('standardTpl') standardTemplateRef!: TemplateRef<any>;
  @ViewChild('successTpl') successTemplateRef!: TemplateRef<any>;
  @ViewChild('dangerTpl') errorTemplateRef!: TemplateRef<any>;

  public productForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private productServices: ProductsService,
    private modalService: NgbModal,
    private appState: AppStateService,
    private toastService: ToastService
    ) {
  }

  ngOnInit() {
    this.resetFormControl()
  }

  showStandard(template: TemplateRef<any>) {
    this.toastService.show({ template: template, delay: 1000});
  }

  showSuccess(template: TemplateRef<any>) {
    this.toastService.show({ template, classname: 'bg-success text-light', delay: 3000 });
  }

  showDanger(template: TemplateRef<any>) {
    this.toastService.show({ template, classname: 'bg-danger text-light', delay: 3000 });
  }

  openModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', keyboard: false });
  }

  closeModal() {
    this.modalService.dismissAll()
  }

  saveProduct(product: Product) {
    this.showStandard(this.standardTemplateRef)
    this.productServices.saveProduct(product).subscribe({
      next: () => {
        this.appState.getAllProducts()
        this.openModal(this.myModalContent)
        this.resetFormControl()
        this.showSuccess(this.successTemplateRef)
      }, error: err => {
        console.error(err)
        this.showDanger(this.errorTemplateRef)
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
