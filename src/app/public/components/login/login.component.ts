import { appRoutes } from '@/app/app.routes';
import { CustomInputComponent } from '@/app/components';
import { AuthService, LocalManagerService } from '@/app/services';
import { afterNextRender, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CustomInputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  localManager = inject(LocalManagerService);

  loginForm = new FormGroup<LoginForm>({
    email: new FormControl('', { nonNullable: true, validators: [Validators.email, Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor() { 
    afterNextRender(() => {
      this.localManager.clearStorage()
    })
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      try {
        await firstValueFrom(this.authService.login(this.loginForm.getRawValue()));
        
        this.router.navigate([`/${appRoutes.private.root}/${appRoutes.private.characters}`], { replaceUrl: true });
      } catch (error) {
        console.error(error);
      }
    }
    this.loginForm.reset();
  }
}
