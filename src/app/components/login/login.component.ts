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
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  loguear(){
    const email = this.loginUsuario.value.email;
    const password = this.loginUsuario.value.password;
    
    this.spinner= true;
    this.afAuth.signInWithEmailAndPassword(email,password).then((user)=>{
      console.log(user);
      if(user.user?.emailVerified){
         this.router.navigate(['/dashboard']);
      }else{
        this.router.navigate(['/verificar-correo']);
      }
    }).catch((error) => {
      console.log(error);
      this.spinner=false;
      this.firebaseError(error.code);
    })
  }

  firebaseError(code: string){
    switch(code){
      case FireBaseCodeErrorEnum.WrongPassword:
        return this.errorAlerta('La contraseña es incorrecta','X');
      case FireBaseCodeErrorEnum.UserNotFound:
        return this.errorAlerta('Usuario no encontrado','X');
      case FireBaseCodeErrorEnum.InvalidEmail:
        return this.errorAlerta('Correo Invalido o vacio','X');
    }
  }

  //Alertas
  errorAlerta(message: any, type: string){
    this._snackBar.open(message,type,{
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass:['mat-toolbar', 'red-snackbar'],
    })
  }
}
