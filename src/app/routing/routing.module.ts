import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthgardService } from '../auth/authgard.service';
import { PostCreateComponent } from '../posts/post-create/post-create.component';
import { PostListComponent } from '../posts/post-list/post-list.component';


const routes: Routes = [
  { path: '', component: PostListComponent, canActivate: [AuthgardService]},
  { path: 'create', component: PostCreateComponent, canActivate: [AuthgardService]},
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthgardService]},
  { path: 'auth', loadChildren: () => import('../auth/auth.module').then(module => module.AuthModule) }
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
