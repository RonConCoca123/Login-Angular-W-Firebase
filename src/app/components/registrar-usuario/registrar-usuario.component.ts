import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth} from '@angular/fire/compat/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FireBaseCodeErrorEnum } from 'src/app/utils/firebase-code-error-service';

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css']
})


export class RegistrarUsuarioComponent implements OnInit {
  registrarUsuario: FormGroup;
  spinner: boolean = false;
  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private _snackBar: MatSnackBar,
    private router: Router)
    {
    this.registrarUsuario = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      repetirPassword: ['', Validators.required],
    });
  }
  ngOnInit(){

  }

  registrar(){
    const email = this.registrarUsuario.value.email;
    const password = this.registrarUsuario.value.password;
    const repetirPassword = this.registrarUsuario.value.repetirPassword;

    if(password !== repetirPassword){
      this.errorAlerta('Las contraseñas no coinciden');
      return;
    }

    this.spinner=true;
    this.afAuth.createUserWithEmailAndPassword(email,password)
    .then(() => {
      this.spinner=false;
      this.router.navigate(['/login']); 
      this.errorAlerta('La cuenta ha sido creada correctamente');
    }).catch((error) => {
      this.spinner=false;
      this.firebaseError(error.code);
    });
  }

  firebaseError(code: string){
     
    switch(code){
      case FireBaseCodeErrorEnum.EmailAlreadyInUse:
        return this.errorAlerta('El usuario ya existe');
      case FireBaseCodeErrorEnum.WeakPassword:
        return this.errorAlerta('Su contraseña es muy debil, ingrese otra');
      case FireBaseCodeErrorEnum.InvalidEmail:
        return this.errorAlerta('Correo invalido, ingrese uno correcto');
      case FireBaseCodeErrorEnum.InvalidPassword:
        return this.errorAlerta('El valor de la password no es valido');
      default:
        return 'Error desconocido';
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
