import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexComponent } from './index/index.component';
import { MainAppComponent } from './main-app/main-app.component';
import { ProfileComponent } from './main-app/profile/profile.component';
import { HomeComponent } from './main-app/home/home.component';

const routes: Routes = [
    {
        path: '',
        component: IndexComponent
    },
    {
        path: 'in',
        component: MainAppComponent,
        children: [
            {
                path: '',
                component: HomeComponent
            },
            {
                path: 'profile',
                component: ProfileComponent
            }
        ]
    }
    // '**' is missing!
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
