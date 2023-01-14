import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from '../shared-services/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isLoggedIn = true;
  isLoading = false;
  errorMsg: string = null;
  constructor(private authService: AuthService,private router:Router) {}

  ngOnInit(): void {}

  onSwitch() {
    this.isLoggedIn = !this.isLoggedIn;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs:Observable<AuthResponseData>

    this.isLoading = true;

    if (this.isLoggedIn) {
     authObs = this.authService.login(email, password)
    } else {
      authObs =  this.authService.signUp(email, password)
    }

    authObs.subscribe(
      (response) => {
        this.isLoading = false;
        this.router.navigate(['/recipes'])
      },
      (errorMessage) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `${errorMessage}`,
        })
        this.isLoading = false;
      }
    );
    form.reset();
  }
}
