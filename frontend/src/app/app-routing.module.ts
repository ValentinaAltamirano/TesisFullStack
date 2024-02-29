import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { AlojamientoComponent } from './alojamiento/alojamiento.component';
import { GastronomiaComponent } from './gastronomia/gastronomia.component';
import { ComerciosComponent } from './comercios/comercios.component';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { RegistrarseComponent } from './registrarse/registrarse.component';
import { ErrorComponent } from './error/error.component';
import { RegistroEmpresarioComponent } from './registro-empresario/registro-empresario.component';
import { PerfilComponent } from './perfil/perfil.component';
import { AuthService } from './service/auth.service';
import { RegistroAlojamientoComponent } from './registro-alojamiento/registro-alojamiento.component';
import { RegistroGastronomiaComponent } from './registro-gastronomia/registro-gastronomia.component';
import { RegistroComercioComponent } from './registro-comercio/registro-comercio.component';
import { DetalleAlojamientoComponent } from './detalle-alojamiento/detalle-alojamiento.component';
import { MisEstablecimientosComponent } from './mis-establecimientos/mis-establecimientos.component';
import { EditarAlojamientoComponent } from './editar-alojamiento/editar-alojamiento.component';
import { DetalleGastronomiaComponent } from './detalle-gastronomia/detalle-gastronomia.component';
import { RegistroTuristaComponent } from './registro-turista/registro-turista.component';
import { EditarGastronomiaComponent } from './editar-gastronomia/editar-gastronomia.component';
import { DetalleComercioComponent } from './detalle-comercio/detalle-comercio.component';
import { EditarComercioComponent } from './editar-comercio/editar-comercio.component'; 
import { canActivateTuristaGuard } from './service/can-activate-turista.guard';
import { CanActivateEmpresario } from './service/can-activate-empresario.guard';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';

const routes: Routes = [
  {path:'', component: InicioComponent},
  {path:'alojamiento', component:AlojamientoComponent},
  {path:'gastronomia', component:GastronomiaComponent},
  {path:'comercio', component:ComerciosComponent},
  {path: 'inicioSesion', component: InicioSesionComponent},
  {path: 'registrarse', component: RegistrarseComponent},
  {path: 'registroEmpresario', component: RegistroEmpresarioComponent},
  {path: 'registroTurista', component: RegistroTuristaComponent},
  {path: 'registroAlojamiento', component: RegistroAlojamientoComponent, canActivate: [CanActivateEmpresario]},
  {path: 'registroGastronomia', component: RegistroGastronomiaComponent, canActivate: [ CanActivateEmpresario]},
  {path: 'registroComercio', component: RegistroComercioComponent, canActivate: [ CanActivateEmpresario]},
  {path: 'perfil', component: PerfilComponent, canActivate: [ CanActivateEmpresario] },
  {path: 'mi-perfil', component: MiPerfilComponent, canActivate: [canActivateTuristaGuard]},
  {path: 'misEstablecimiento', component: MisEstablecimientosComponent, canActivate: [ CanActivateEmpresario] },
  { path: 'detalle-alojamiento/:id', component: DetalleAlojamientoComponent },
  { path: 'editar-alojamiento/:id', component: EditarAlojamientoComponent, canActivate: [ CanActivateEmpresario] },
  { path: 'detalle-gastronomia/:id', component: DetalleGastronomiaComponent },
  { path: 'editar-gastronomia/:id', component: EditarGastronomiaComponent, canActivate: [ CanActivateEmpresario] },
  { path: 'detalle-comercio/:id', component: DetalleComercioComponent },
  { path: 'editar-comercio/:id', component: EditarComercioComponent, canActivate: [ CanActivateEmpresario] },
  {path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
