import {AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Product} from "../../model/product.model";
import {ProductsService} from "../services/products.service";
import {Router} from "@angular/router";
import {AppStateService} from "../services/app-state.service";
import {ToastService} from "../services/toast-service.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit, OnDestroy, AfterViewInit{
 constructor(private productServices: ProductsService,
             private router: Router,
             public appState: AppStateService,
             private toastService: ToastService) {

 }

 private isFirstRender: boolean = false;

  @ViewChild('standardTpl') loadingDataTemplateRef!: TemplateRef<any>;
  @ViewChild('standardUpdateTpl') updateSTDTemplateRef!: TemplateRef<any>;
  @ViewChild('successUpdateProduct') updateProductTemplateRef!: TemplateRef<any>;
  @ViewChild('successDataLoaded') successDataLoadedTemplateRef!: TemplateRef<any>;
  @ViewChild('successDeleteProduct') successDeleteTemplateRef!: TemplateRef<any>;
  @ViewChild('dangerTpl') errorTemplateRef!: TemplateRef<any>;
  ngAfterViewInit(): void {
    this.showStandard(this.loadingDataTemplateRef);
  }

  ngOnInit() {
    this.getProducts(this.appState.productState.keyword,
      this.appState.productState.thisPage,
      this.appState.productState.size)
    this.isFirstRender = true
 }

  ngOnDestroy(): void {
    this.toastService.clear();
  }

  showStandard(template: TemplateRef<any>) {
    this.toastService.show({ template: template});
  }

  showSuccess(template: TemplateRef<any>) {
    this.toastService.show({ template, classname: 'bg-success text-light', delay: 3000 });
  }

  showDanger(template: TemplateRef<any>) {
    this.toastService.show({ template, classname: 'bg-danger text-light', delay: 3000 });
  }

  getProducts(keyword: string, page: number, size: number){
    this.toastService.clear()
    if(this.isFirstRender) this.showStandard(this.loadingDataTemplateRef);
   this.productServices.getProducts(keyword,page, size).subscribe(
     {
       next: response => {
         let thisPage = page;
         let products = response.body as Product[];
         let totalCurrentProducts = parseInt(response.headers.get('X-Total-Count') || '0'); // Default to 0 if header is missing
         let totalSearchPages = Math.ceil(totalCurrentProducts / size);
         let pagesArray = Array.from({ length: totalSearchPages }, (_, i) => i + 1);

         if(!products.length) {
           thisPage --;
           if(thisPage <= 0) products = []
           else this.getProducts(keyword, thisPage, size);
         }
         this.appState.getAllProducts()
         this.appState.setState({
           products: products,
           thisPage: thisPage,
           totalCurrentProducts: totalCurrentProducts,
           totalSearchPages: totalSearchPages,
           pagesArray: pagesArray,
           keyword: keyword,
           size: size
         })
         if(keyword == '') {
           this.showSuccess(this.successDataLoadedTemplateRef)
         }
       },
       error: err => {
         console.error(err.message())
         this.showDanger(this.errorTemplateRef)
       }
     })
 }

  updateProduct(product: Product, field: string) {
    this.showStandard(this.updateSTDTemplateRef);
    this.productServices.updateFieldProduct(product, field)
      .subscribe({
        next: updatedProduct => {
          const productIndex: number = this.appState.productState.products.findIndex(p => p.id === updatedProduct.id);
          if (productIndex !== -1) {
            this.appState.updateOneProduct(productIndex, updatedProduct)
          }
          this.showSuccess(this.updateProductTemplateRef)
        },
        error: err => {
          console.error(err);
          this.showDanger(this.errorTemplateRef)
        }
      });
  }

  deleteProduct() {
    if (this.appState.productState.selectedProduct) {
      this.productServices.deleteProduct(this.appState.productState.selectedProduct)
        .subscribe({
          next: () => {
            this.appState.getAllProducts()
            this.getProducts(this.appState.productState.keyword,this.appState.productState.thisPage,this.appState.productState.size)
            this.appState.productState.selectedProduct = null; // Clear selected product after deletion
            this.showSuccess(this.successDeleteTemplateRef)
          },
          error: err => {
            console.error(err.message);
            this.showDanger(this.errorTemplateRef)
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
