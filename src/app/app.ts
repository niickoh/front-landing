import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { Header } from './core/layout/header/header';
import { Footer } from './core/layout/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, Header, Footer],
  templateUrl: './app.html',
})
export class App {}

