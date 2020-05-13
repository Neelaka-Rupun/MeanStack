import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postsUpdatd = new Subject<{posts: Post[], postCount: number}>();

  constructor(private httpClient: HttpClient, private router: Router) {

  }
  getPosts(postPerPage: number, currentPage: number) {
    const queryPrams = `?pageSize=${postPerPage}&page=${currentPage}`;
    this.httpClient.get<{ message: string, posts: any[], maxPosts: number}>('http://localhost:3000/api/posts' + queryPrams)
      .pipe(map(postData => {
        return {posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator
          };
        }), maxPosts: postData.maxPosts};
      }))
      .subscribe((transformedPostsData) => {
        this.posts = transformedPostsData.posts;
        this.postsUpdatd.next({
          posts: [...this.posts],
          postCount: transformedPostsData.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdatd.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.httpClient.post<{ message: string; post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe((responseData) => {
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    return  this.httpClient.delete('http://localhost:3000/api/posts/' + postId);
  }

  getPost(id: string) {
    // tslint:disable-next-line: max-line-length
    return this.httpClient.get<{ _id: string, title: string, content: string, imagePath: string, creator: string }>('http://localhost:3000/api/posts/' + id);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.httpClient.put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });

  }
}
