import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-testing',
  imports: [ButtonModule],
  templateUrl: './testing.html',
  styleUrl: './testing.css',
})
export class Testing {
  constructor(private http: HttpClient) {
    http.get('https://dummyjson.com/carts').subscribe((data: any) => {
      this.products.nothing = data.carts[0].products[0].id;
     });

  }
  products={"nothing":50};
  counter =signal<number>(42);
  activecounter() {
    let xxx: () => void= () => setTimeout(() => {
      this.counter.set(this.counter() + 50);
    }, 1000);
    xxx();
  }

}
