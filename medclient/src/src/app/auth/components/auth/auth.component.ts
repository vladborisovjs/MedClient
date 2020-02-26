import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../services/user.service';
import {LoginPair} from '../../../../../swagger/med-api.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  // constructor(private auth: AuthTokenService, private router: Router) { }
  constructor(private router: Router, private user: UserService) { }
  // logPair: LoginPair;

  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  error: string = null;
  ngOnInit() {
  }
  onSubmit(e) {

    e.preventDefault();

    if (this.form.invalid) {
      this.error = 'Не введен логин и/или пароль';
      this.form.get('username').markAsTouched();
      this.form.get('password').markAsTouched();
      return;
    }

    this.user.login(LoginPair.fromJS(this.form.getRawValue())).subscribe(
      ()=>{},
      ()=>{
        this.error = 'Неверный логин и/или пароль'
      }
    );
  }

}
