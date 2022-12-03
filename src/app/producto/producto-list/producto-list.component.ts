import { Component, OnInit } from '@angular/core';
import { Producto } from '../producto';
import { ProductoService } from '../producto.service';

@Component({
  selector: 'app-producto-list',
  templateUrl: './producto-list.component.html',
  styleUrls: ['./producto-list.component.css']
})
export class ProductoListComponent implements OnInit {
  pageTitle = 'Producto List';
  filteredProductos: Producto[] = [];
  productos: Producto[] = [];
  errorMessage = '';

  _listFilter = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredProductos = this.listFilter ? this.performFilter(this.listFilter) : this.productos;
  }

  constructor(private productoService: ProductoService) { }

  performFilter(filterBy: string): Producto[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.productos.filter((producto: Producto) =>
      producto.name.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
      producto.slug.indexOf(filterBy) !== -1 ||
      producto.category.name.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
      producto.brand.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  ngOnInit(): void {
    this.getProductoData();
  }

  getProductoData() {
    this.productoService.getProductos()
      .subscribe({
        next: (productos) => {
          this.productos = productos;
          this.filteredProductos = productos;
        },
        error: (err) => this.errorMessage = <any>err,
        complete: () => console.info('Get productos in producto list')
      });
  }

  deleteProducto(id: string, name: string): void {
    if (id === '') {
      this.onSaveComplete();
    } else {
      if (confirm(`Are you sure want to delete this Producto: ${name}?`)) {
        this.productoService.deleteProducto(id)
          .subscribe({
            next: () => this.onSaveComplete(),
            error: (err) => this.errorMessage = <any>err,
            complete: () => console.info('Delete producto in producto list')
          });
      }
    }
  }

  onSaveComplete(): void {
    this.productoService.getProductos()
      .subscribe({
        next: (productos) => {
          this.productos = productos;
          this.filteredProductos = productos;
        },
        error: (err) => this.errorMessage = <any>err,
        complete: () => console.info('Get productos in producto list')
      });
  }
}
