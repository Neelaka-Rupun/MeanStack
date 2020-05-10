import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { sharedStylesheetJitUrl } from '@angular/compiler';
import { Post } from '../post.model';
import { PostService } from '../posts.service';
import { PageEvent } from '@angular/material';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title : 'First Post', content: 'This is the first post\'s content'},
  //   {title : 'Second Post', content: 'This is the Second post\'s content'},
  //   {title : 'Third Post', content: 'This is the Third post\'s content'}
  // ];
    posts: Post[] = [];
    isLoading = false;
    totalPosts = 0;
    postPerPage = 2;
    currentPage = 1;
    pageSizeOptions = [1, 2, 5, 10];
    private postsSub: Subscription;
    constructor(public postsService: PostService) {
    }
    ngOnInit() {
      this.isLoading = true;
      this.postsService.getPosts(this.postPerPage, this.currentPage);
      this.postsSub = this.postsService.getPostUpdateListener().subscribe((postData : { posts: Post[], postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
    }

    ngOnDestroy() {
        this.postsSub.unsubscribe();
    }

    onDelete(postId: string) {
      this.isLoading = true;
      this.postsService.deletePost(postId).subscribe( () => {
        this.postsService.getPosts(this.postPerPage, this.currentPage);
      });
    }

    onChangedPage(pageData: PageEvent) {
      this.isLoading = true;
      this.currentPage = pageData.pageIndex + 1;
      this.postPerPage = pageData.pageSize;
      this.postsService.getPosts(this.postPerPage, this.currentPage);
    }
}
