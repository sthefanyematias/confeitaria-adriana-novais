
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  form!: FormGroup;
  erroLogin = '';
  carregando = false;
  mostrarSenha = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.auth.estaAutenticado()) {
      this.router.navigate(['/admin/home']);
      return;
    }

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });
  }

  campoInvalido(campo: string): boolean {
    const c = this.form.get(campo);
    return !!(c && c.invalid && c.touched);
  }

  entrar(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    this.carregando = true;
    this.erroLogin = '';

    this.auth.login(this.form.value).subscribe({
      next: () => this.router.navigate(['/admin/home']),
      error: (err) => {
        this.erroLogin = err.error?.erro || 'E-mail ou senha inválidos';
        this.carregando = false;
      }
    });
  }
}
