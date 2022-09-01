import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loginForm: FormGroup | any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [ Validators.required, Validators.email, Validators.pattern(
        '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,63}$')]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  onSubmit(): void {
    if (this.authService.login(this.loginForm.value)) {
      this.router.navigate(["/dashboard"]);
    } else {
      this.snackBar.open("Oops - invalid credentials", 'Error', {
        duration: 3 * 1000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      })
    }
  }

}
