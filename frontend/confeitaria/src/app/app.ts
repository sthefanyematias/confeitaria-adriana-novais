
import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { Modal } from './components/modal/modal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, Modal],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  exibirPublicos = true;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe((e) => {
      this.exibirPublicos = !e.urlAfterRedirects.startsWith('/admin');
    });
  }
}
