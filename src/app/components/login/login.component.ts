import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FireBaseCodeErrorEnum } from 'src/app/utils/firebase-code-error-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  loginUsuario: FormGroup;
  spinner: boolean = false;
  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private _snackBar: MatSnackBar,
    private router: Router){

    this.loginUsuario = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  loguear(){
    const email = this.loginUsuario.value.email;
    const password = this.loginUsuario.value.password;
    
    this.spinner= true;
    this.afAuth.signInWithEmailAndPassword(email,password).then((user)=>{
      this.router.navigate(['/dashboard']);
    }).catch((error) => {
      console.log(error);
      this.spinner=false;
      this.firebaseError(error.code);
    })
  }

  firebaseError(code: string){
    switch(code){
      case FireBaseCodeErrorEnum.WrongPassword:
        return this.errorAlerta('La contraseña es incorrecta');
      case FireBaseCodeErrorEnum.UserNotFound:
        return this.errorAlerta('Usuario no encontrado')
    }
  }

  //Alertas
  errorAlerta(message: string){
    this._snackBar.open(message,'X',{
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    })
  }
}
