import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postsUpdatd = new Subject<Post[]>();

  constructor(private httpClient: HttpClient, private router: Router) {

  }
  getPosts() {
    this.httpClient.get<{ message: string; posts: any[]; }>('http://localhost:3000/api/posts')
      .pipe(map(postData => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          };
        });
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdatd.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdatd.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.httpClient.post<{ message: string; post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe((responseData) => {
        const post: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath
        };
        this.posts.push(post);
        this.postsUpdatd.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    this.httpClient.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPost = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPost;
        this.postsUpdatd.next([...this.posts]);
      });
  }

  getPost(id: string) {
    return this.httpClient.get<{ _id: string, title: string, content: string, imagePath: string }>('http://localhost:3000/api/posts/' + id);
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
        imagePath: image
      };
    }
    this.httpClient.put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(response => {
        const updatedPost = [...this.posts];
        const oldPostIndex = updatedPost.findIndex(p => p.id === id);
        const post: Post ={
          // tslint:disable-next-line: object-literal-shorthand
          id: id,
           // tslint:disable-next-line: object-literal-shorthand
          title: title,
           // tslint:disable-next-line: object-literal-shorthand
          content: content,
           // tslint:disable-next-line: object-literal-shorthand
          imagePath: ""
        };
        updatedPost[oldPostIndex] = post;
        this.posts = updatedPost;
        this.postsUpdatd.next([...this.posts]);
        this.router.navigate(["/"]);
      });

  }
}
