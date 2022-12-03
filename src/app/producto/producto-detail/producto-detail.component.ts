import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from '../producto';
import { ProductoService } from '../producto.service';

@Component({
  selector: 'app-producto-detail',
  templateUrl: './producto-detail.component.html',
  styleUrls: ['./producto-detail.component.css']
})
export class ProductoDetailComponent implements OnInit {
  pageTitle = 'Producto Detail';
  errorMessage = '';
  producto: Producto | undefined;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getProducto(id);
    }
  }

  getProducto(id: string) {
    this.productoService.getProducto(id)
      .subscribe({
        next: (producto) => this.producto = producto,
        error: (err) => this.errorMessage = <any>err,
        complete: () => console.info('Get producto in producto details')
      });
  }

  onBack(): void {
    this.router.navigate(['/productos']);
  }
}
