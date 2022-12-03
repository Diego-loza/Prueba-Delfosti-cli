import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Producto } from './producto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private productosUrl = environment.baseUrl + 'api/Product';

  constructor(private http: HttpClient) { }

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.productosUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getProducto(_id: string | null): Observable<Producto> {
    if (_id === '') {
      return of(this.initializeProducto());
    }
    const url = `${this.productosUrl}/${_id}`;
    return this.http.get<Producto>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  createProducto(producto: Producto): Observable<Producto> {
    producto._id = '';
    return this.http.post<Producto>(this.productosUrl, producto)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteProducto(_id: string): Observable<{}> {
    const url = `${this.productosUrl}/${_id}`;
    return this.http.delete<Producto>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateProducto(producto: Producto): Observable<Producto> {
    const url = `${this.productosUrl}/${producto._id}`;
    return this.http.put<Producto>(url, producto)
      .pipe(
        map(() => producto),
        catchError(this.handleError)
      );
  }

  private handleError(err: any) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(() => errorMessage);
  }

  private initializeProducto(): Producto {
    return {
      _id: "",
      name: "",
      category: {
        name: "",
        slug: ""
      },
      brand: {
        name: "",
        slug: ""
      },
      slug: "",
      status: 1
    };
  }
}
