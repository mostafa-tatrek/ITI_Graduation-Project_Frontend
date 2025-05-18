import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { StartHereComponent } from './components/start-here/start-here.component';
import { ReceipeComponent } from './components/receipe/receipe.component';
import { RecipesShowComponent } from './components/recipes-show/recipes-show.component';
import { OneRecipeShowComponent } from './components/one-recipe-show/one-recipe-show.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AdminProfileComponent } from './components/admin-profile/admin-profile.component';
import { ProfileDataEditingComponent } from './components/profile-data-editing/profile-data-editing.component';
import { notAuthGuard } from './guard/not-auth.guard';
import { loginGuardGuard } from './guard/login-guard.guard';
import { userGuardGuard } from './guard/user-guard.guard';
import { adminGuard } from './guard/admin.guard';
import { adminNavigateGuard } from './guard/admin-navigate.guard';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent, canActivate: [adminNavigateGuard] },
  {
    path: 'about',
    component: AboutComponent,
    canActivate: [adminNavigateGuard],
  },
  {
    path: 'recipe',
    component: ReceipeComponent,
    canActivate: [adminNavigateGuard],
  },
  {
    path: 'Login',
    component: LogInComponent,
    canActivate: [loginGuardGuard],
  },
  {
    path: 'resetPassword',
    component: ResetPasswordComponent,
    canActivate: [loginGuardGuard],
  },
  {
    path: 'SignUp',
    component: SignUpComponent,
    canActivate: [loginGuardGuard],
  },
  {
    path: 'startHere',
    component: StartHereComponent,
    canActivate: [adminNavigateGuard],
  },
  {
    path: 'recipesShow/:id',
    component: RecipesShowComponent,
    canActivate: [adminNavigateGuard],
  },
  {
    path: 'oneRecipeShow/:recipeID',
    component: OneRecipeShowComponent,
    canActivate: [adminNavigateGuard],
  },
  {
    path: 'UserProfile/:UserId',
    component: UserProfileComponent,
    canActivate: [userGuardGuard],
  },
  {
    path: 'Admin/:AdminID',
    component: AdminProfileComponent,
    canActivate: [adminGuard],
  },
  { path: 'EditProfile/:UserId', component: ProfileDataEditingComponent },

  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
