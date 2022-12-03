import { Component, OnInit, OnDestroy, ElementRef, ViewChildren } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from '../producto';
import { ProductoService } from '../producto.service';
var slug = require('slug')

@Component({
  selector: 'app-producto-edit',
  templateUrl: './producto-edit.component.html',
  styleUrls: ['./producto-edit.component.css']
})
export class ProductoEditComponent implements OnInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];
  pageTitle = 'Producto Edit';
  errorMessage!: string;
  productoForm!: FormGroup;
  tranMode!: string;
  producto!: Producto;
  private sub!: Subscription;

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService) {

    this.validationMessages = {
      name: {
        required: 'Name is required.',
      },
      categoryname: {
        required: 'Category name is required.',
      },
      brandname: {
        required: 'Brand name is required.',
      }
    };
  }

  ngOnInit() {
    this.tranMode = "new";
    this.productoForm = this.fb.group({
      name: ['', [Validators.required]],
      categoryname: ['', [Validators.required]],
      brandname: ['', [Validators.required]],
    });

    this.sub = this.route.paramMap.subscribe(
      params => {
        const _id = params.get('_id');
        const category = params.get('category');
        const brand = params.get('brand');
        if (_id == '0') {
          const producto: Producto = { _id: "0", name: "", category: {name: "", slug: ""}, brand: {name: "", slug: ""}, slug: "", status: 1 };
          this.displayProducto(producto);
        }
        else {
          this.getProducto(_id);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getProducto(_id: string | null): void {
    this.productoService.getProducto(_id)
      .subscribe({
        next: (producto: Producto) => this.displayProducto(producto),
        error: (err) => this.errorMessage = <any>err,
        complete: () => console.info('Get producto in producto edit')
      });
  }

  displayProducto(producto: Producto): void {
    if (this.productoForm) {
      this.productoForm.reset();
    }
    this.producto = producto;
    if (this.producto._id == '0') {
      this.pageTitle = 'Add Producto';
    } else {
      this.pageTitle = `Edit Producto: ${this.producto.name}`;
    }
    this.productoForm.patchValue({
      name: this.producto.name,
      categoryname: this.producto.category.name,
      brandname: this.producto.brand.name,
      status: this.producto.status
    });
  }

  deleteProducto(): void {
    if (this.producto._id == '0') {
      this.onSaveComplete();
    } else {
      if (confirm(`Are you sure want to delete this Producto: ${this.producto.name}?`)) {
        this.productoService.deleteProducto(this.producto._id)
          .subscribe({
            next: () => this.onSaveComplete(),
            error: (err) => this.errorMessage = <any>err,
            complete: () => console.info('Delete producto in producto edit')
          });
      }
    }
  }

  saveProducto(): void {
    if (this.productoForm.valid) {
      if (this.productoForm.dirty) {
        const e = { ...this.producto, ...this.productoForm.value };
        if (e._id === '0') {
          e.category.name = e.categoryname;
          e.category.slug = slug(e.categoryname).toLocaleLowerCase();
          e.brand.name = e.brandname;
          e.brand.slug = slug(e.brandname).toLocaleLowerCase();
          e.slug = slug(e.name).toLocaleLowerCase();
          console.log(e);
          this.productoService.createProducto(e)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: (err) => this.errorMessage = <any>err,
              complete: () => console.info('Create producto in producto edit')
            });
        } else {
          e.category.name = e.categoryname;
          e.category.slug = slug(e.categoryname).toLocaleLowerCase();
          e.brand.name = e.brandname;
          e.brand.slug = slug(e.brandname).toLocaleLowerCase();
          e.slug = slug(e.name).toLocaleLowerCase();
          console.log(e);
          this.productoService.updateProducto(e)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: (err) => this.errorMessage = <any>err,
              complete: () => console.info('Update producto in producto edit')
            });
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(): void {
    this.productoForm.reset();
    this.router.navigate(['/productos']);
  }
}
