import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FireBaseCodeErrorEnum } from 'src/app/utils/firebase-code-error-service';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css']
})
export class RecuperarPasswordComponent implements OnInit {
  recuperarUsuario: FormGroup;
  spinner: boolean = false;
  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private _snackBar: MatSnackBar,
    private router: Router) {
    this.recuperarUsuario = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
    })
  }
  ngOnInit() {

  }

  recuperar() {
    const correo = this.recuperarUsuario.value.correo;
    this.spinner = true;

    this.afAuth.sendPasswordResetEmail(correo).then((user) => {
      this.notifyAlerta('Le enviamos un correo para restablecer su password','X')
      this.router.navigate(['/login']);
    }).catch((error) => {
      this.spinner = false;
      this.firebaseError(error.code)
      console.log(error);
    })
  }

  firebaseError(code: string){
    switch(code){
      case FireBaseCodeErrorEnum.MissingEmail:
        return this.errorAlerta('Email vacio, ingrese su correo','X');
      case FireBaseCodeErrorEnum.UserNotFound:
        return this.errorAlerta('Usuario no encontrado','X');
      case FireBaseCodeErrorEnum.InvalidEmail:
        return this.errorAlerta('Correo Invalido','X');
    }
  }

  //Alertas
  errorAlerta(message: any, type: string) {
    this._snackBar.open(message, type, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['mat-toolbar', 'red-snackbar'],
    })
  }
  
  notifyAlerta(message: any, type: string) {
    this._snackBar.open(message, type, {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['mat-toolbar', 'blue-snackbar'],
    })
  }
}
