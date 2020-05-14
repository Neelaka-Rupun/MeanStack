import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { sharedStylesheetJitUrl } from '@angular/compiler';
import { Post } from '../post.model';
import { PostService } from '../posts.service';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';
import { subscribeOn } from 'rxjs/operators';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

    posts: Post[] = [];
    isLoading = false;
    totalPosts = 0;
    postPerPage = 2;
    currentPage = 1;
    pageSizeOptions = [1, 2, 5, 10];
    private postsSub: Subscription;
    private authStatusSub: Subscription;
    public userIsAuthenticated = false;
    userId: string;

    constructor(public postsService: PostService, private authService: AuthService) {}
    ngOnInit() {
      this.isLoading = true;
      this.postsService.getPosts(this.postPerPage, this.currentPage);
      this.postsSub = this.postsService.getPostUpdateListener().subscribe((postData: { posts: Post[], postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
        this.userId = this.authService.getUserId();
      });
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe( isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
    }

    ngOnDestroy() {
        this.postsSub.unsubscribe();
        this.authStatusSub.unsubscribe();
    }

    onDelete(postId: string) {
      this.isLoading = true;
      this.postsService.deletePost(postId).subscribe( () => {
        this.postsService.getPosts(this.postPerPage, this.currentPage);
      }, () => {
        this.isLoading = false;
      });
    }

    onChangedPage(pageData: PageEvent) {
      this.isLoading = true;
      this.currentPage = pageData.pageIndex + 1;
      this.postPerPage = pageData.pageSize;
      this.postsService.getPosts(this.postPerPage, this.currentPage);
    }
}
