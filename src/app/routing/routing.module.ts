import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from '../posts/post-list/post-list.component';
import { PostCreateComponent } from '../posts/post-create/post-create.component';
import { LoginComponent } from '../auth/login/login.component';
import { SignupComponent } from '../auth/signup/signup.component';
import { AuthgardService } from '../auth/authgard.service';

const routes: Routes = [
  { path: '', component: PostListComponent, canActivate: [AuthgardService]},
  { path: 'create', component: PostCreateComponent, canActivate: [AuthgardService]},
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthgardService]},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  providers: [AuthgardService],
  exports: [RouterModule]
})
export class AppRoutingModule { }
