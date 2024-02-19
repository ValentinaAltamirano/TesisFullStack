import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlojamientoComponent } from './alojamiento/alojamiento.component';
import { GastronomiaComponent } from './gastronomia/gastronomia.component';
import { ComerciosComponent } from './comercios/comercios.component';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { RegistrarseComponent } from './registrarse/registrarse.component';
import { InicioComponent } from './inicio/inicio.component';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './error/error.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RegistroEmpresarioComponent } from './registro-empresario/registro-empresario.component';
import {GoogleMapsModule } from '@angular/google-maps';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PerfilComponent } from './perfil/perfil.component';
import { RegistroAlojamientoComponent } from './registro-alojamiento/registro-alojamiento.component';
import { RegistroGastronomiaComponent } from './registro-gastronomia/registro-gastronomia.component';
import { RegistroComercioComponent } from './registro-comercio/registro-comercio.component';
import { CookieService } from 'ngx-cookie-service';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { DetalleAlojamientoComponent } from './detalle-alojamiento/detalle-alojamiento.component';
import { MisEstablecimientosComponent } from './mis-establecimientos/mis-establecimientos.component';
import { EditarAlojamientoComponent } from './editar-alojamiento/editar-alojamiento.component';
import { DetalleGastronomiaComponent } from './detalle-gastronomia/detalle-gastronomia.component';
import { RegistroTuristaComponent } from './registro-turista/registro-turista.component';

const appRoutes: Routes=[];

@NgModule({
  declarations: [
    AppComponent,
    AlojamientoComponent,
    GastronomiaComponent,
    ComerciosComponent,
    InicioSesionComponent,
    RegistrarseComponent,
    InicioComponent,
    ErrorComponent,
    FooterComponent,
    NavbarComponent,
    RegistroEmpresarioComponent,
    PerfilComponent,
    RegistroAlojamientoComponent,
    RegistroGastronomiaComponent,
    RegistroComercioComponent,
    DetalleAlojamientoComponent,
    MisEstablecimientosComponent,
    EditarAlojamientoComponent,
    DetalleGastronomiaComponent,
    RegistroTuristaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    GoogleMapsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxDropzoneModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
