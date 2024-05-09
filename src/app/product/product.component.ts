import { AfterViewInit, Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
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
export class ProductComponent implements OnDestroy, AfterViewInit {
  private unsubscribe$ = new Subject<void>();

  constructor(
    private productServices: ProductsService,
    private router: Router,
    public appState: AppStateService,
    public toastService: ToastService,
  ) {}

  @ViewChild('toastTemplate') toastTemplate!: TemplateRef<any>;
  @ViewChild('successTpl') successTemplateRef!: TemplateRef<any>;
  @ViewChild('dangerTpl') errorTemplateRef!: TemplateRef<any>;

  ngAfterViewInit(): void {
    this.getProducts(this.appState.productState.keyword, this.appState.productState.thisPage, this.appState.productState.size);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.toastService.clear();
  }

  showToast(template: TemplateRef<any>, innerText: string, classname: string): void {
    this.toastService.show({ template, text: innerText, classname: classname, delay: 30000 });
  }

  getProducts(keyword: string, page: number, size: number) {
    this.toastService.clear();
    this.showToast(this.toastTemplate,'Loading products...', this.toastService.standardToastClassName);
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
            this.showToast(this.toastTemplate,'Product successfully loaded.',this.toastService.successToastClassName);
          }
        },
        error: err => {
          console.error(err);
          this.showToast(this.toastTemplate, 'Oops, something went wrong!', this.toastService.errorToastClassName);
        }
      });
  }

  updateProduct(product: Product, field: string) {
    this.showToast(this.toastTemplate,'Updating product information...', this.toastService.standardToastClassName);
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
          this.showToast(this.successTemplateRef,'Product successfully updated',this.toastService.successToastClassName);
        },
        error: err => {
          console.error(err);
          this.showToast(this.toastTemplate, 'Oops, something went wrong!', this.toastService.errorToastClassName);
        }
      });
  }

  deleteProduct() {
    if (this.appState.productState.selectedProduct) {
      this.showToast(this.toastTemplate,'Deleting product information...',this.toastService.standardToastClassName);
      this.productServices
        .deleteProduct(this.appState.productState.selectedProduct)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: () => {
            this.toastService.clear()
            this.appState.getAllProducts();
            this.showToast(this.toastTemplate,'Product successfully deleted',this.toastService.successToastClassName);
            this.getProducts(
              this.appState.productState.keyword,
              this.appState.productState.thisPage,
              this.appState.productState.size
            );
            this.appState.productState.selectedProduct = null;
          },
          error: err => {
            console.error(err);
            this.showToast(this.toastTemplate, 'Oops, something went wrong!', this.toastService.errorToastClassName);
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
