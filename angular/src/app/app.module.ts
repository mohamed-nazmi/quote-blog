import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { MainAppComponent } from './main-app/main-app.component';
import { SignupComponent } from './index/signup/signup.component';
import { LoginComponent } from './index/login/login.component';
import { NavbarComponent } from './main-app/navbar/navbar.component';
import { ProfileComponent } from './main-app/profile/profile.component';
import { HomeComponent } from './main-app/home/home.component';
import { QuotesComponent } from './main-app/quotes/quotes.component';
import { FriendsComponent } from './main-app/profile/friends/friends.component';

@NgModule({
    declarations: [
        AppComponent,
        IndexComponent,
        MainAppComponent,
        SignupComponent,
        LoginComponent,
        NavbarComponent,
        ProfileComponent,
        HomeComponent,
        QuotesComponent,
        FriendsComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
