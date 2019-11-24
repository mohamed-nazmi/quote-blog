import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexComponent } from './index/index.component';
import { MainAppComponent } from './main-app/main-app.component';
import { ProfileComponent } from './main-app/profile/profile.component';
import { HomeComponent } from './main-app/home/home.component';
import { AuthGuard } from './index/auth.guard';
import { LogoutGuard } from './index/logout.guard';

const routes: Routes = [
    {
        path: '',
        component: IndexComponent,
        canActivate: [LogoutGuard]
    },
    {
        path: 'in',
        component: MainAppComponent,
        children: [
            {
                path: '',
                component: HomeComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'profile',
                component: ProfileComponent,
                canActivate: [AuthGuard]
            }
        ]
    }
    // '**' is missing!
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard, LogoutGuard]
})
export class AppRoutingModule { }
