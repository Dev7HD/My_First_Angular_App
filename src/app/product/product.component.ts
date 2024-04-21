import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Product } from '../../model/product.model';
import { ProductsService } from '../services/products.service';
import { Router } from '@angular/router';
import { AppStateService } from '../services/app-state.service';
import { ToastService } from '../services/toast-service.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    private productServices: ProductsService,
    private router: Router,
    public appState: AppStateService,
    public toastService: ToastService
  ) {}

  @ViewChild('standardTpl') standardTemplateRef!: TemplateRef<any>;
  @ViewChild('successTpl') successTemplateRef!: TemplateRef<any>;
  @ViewChild('dangerTpl') errorTemplateRef!: TemplateRef<any>;

  private unsubscribe$ = new Subject<void>();
  private isFirstRender: boolean = true

  ngAfterViewInit(): void {
    this.getProducts(this.appState.productState.keyword, this.appState.productState.thisPage, this.appState.productState.size);
  }

  ngOnInit() {

    this.isFirstRender = true
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.toastService.clear();
  }

  showStandard(template: TemplateRef<any>, innerText: string) {
    this.toastService.show({ template, text: innerText, classname: 'p-3' });
  }

  showSuccess(template: TemplateRef<any>, innerText: string) {
    this.toastService.show({ template, classname: 'bg-success text-light p-3', delay: 3000, text: innerText });
  }

  showDanger(template: TemplateRef<any>) {
    this.toastService.show({ template, classname: 'bg-danger text-light p-3', delay: 6000 });
  }

  getProducts(keyword: string, page: number, size: number) {
    if(this.isFirstRender){
      this.toastService.clear();
    }
    this.showStandard(this.standardTemplateRef,'Loading products...');
    this.productServices
      .getProducts(keyword, page, size)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          let thisPage = page;
          let products = response.body as Product[];
          let totalCurrentProducts = parseInt(response.headers.get('X-Total-Count') || '0');
          let totalSearchPages = Math.ceil(totalCurrentProducts / size);
          let pagesArray = Array.from({ length: totalSearchPages }, (_, i) => i + 1);
          if (!products.length) {
            thisPage--;
            if (thisPage <= 0) products = [];
            else this.getProducts(keyword, thisPage, size);
          }
          this.appState.getAllProducts();
          this.appState.setState({
            products,
            thisPage,
            totalCurrentProducts,
            totalSearchPages,
            pagesArray,
            keyword,
            size
          });
          this.toastService.clear();
          if (keyword === '') {
            this.showSuccess(this.successTemplateRef,'Product successfully updated');
          }
          this.isFirstRender = false
        },
        error: err => {
          console.error(err);
          this.showDanger(this.errorTemplateRef);
        }
      });
  }

  updateProduct(product: Product, field: string) {
    this.showStandard(this.standardTemplateRef,'Updating product information...');
    this.productServices
      .updateFieldProduct(product, field)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: updatedProduct => {
          const productIndex: number = this.appState.productState.products.findIndex(p => p.id === updatedProduct.id);
          if (productIndex !== -1) {
            this.appState.updateOneProduct(productIndex, updatedProduct);
          }
          this.toastService.clear()
          this.showSuccess(this.successTemplateRef,'Product successfully updated');
        },
        error: err => {
          console.error(err);
          this.showDanger(this.errorTemplateRef);
        }
      });
  }

  deleteProduct() {
    if (this.appState.productState.selectedProduct) {
      this.showStandard(this.standardTemplateRef,'Deleting product information...');
      this.productServices
        .deleteProduct(this.appState.productState.selectedProduct)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: () => {
            this.toastService.clear()
            this.appState.getAllProducts();
            this.showSuccess(this.successTemplateRef,'Product successfully deleted');
            this.getProducts(
              this.appState.productState.keyword,
              this.appState.productState.thisPage,
              this.appState.productState.size
            );
            this.appState.productState.selectedProduct = null;
          },
          error: err => {
            console.error(err);
            this.showDanger(this.errorTemplateRef);
          }
        });
    }
  }

  setProduct(product: Product) {
    if (product != null) {
      this.appState.productState.selectedProduct = product;
    }
  }

  handleUpdate(product: Product) {
    this.router.navigateByUrl(`/edit/${product.id}`);
  }
}
