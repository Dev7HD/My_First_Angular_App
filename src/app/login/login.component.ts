import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  formLogin!: FormGroup;
  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
        this.formLogin = this.formBuilder.group({
          userName : this.formBuilder.control("", Validators.required),
          password: this.formBuilder.control("", Validators.required)
        })
    }

  handelLogin() {
    console.table(this.formLogin.value);
  }
}
