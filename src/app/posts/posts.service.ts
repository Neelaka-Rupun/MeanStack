import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postsUpdatd = new Subject<Post[]>();

  constructor(private httpClient: HttpClient) {

  }
  getPosts() {
    this.httpClient.get<{ message: string; posts: any[]; }>('http://localhost:3000/api/posts')
      .pipe(map(postData => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
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

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.httpClient.post<{ message: string; postId: string; }>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        const id = responseData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdatd.next([...this.posts]);
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

  getPost(id: string ) {
    return this.httpClient.get<{ _id: string; title: string; content: string; }>('http://localhost:3000/api/posts/' + id);
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id: id, title: title, content: content};
    this.httpClient.put('http://localhost:3000/api/posts/' + id, post )
    .subscribe( response => {
      const updatedPost = [...this.posts];
      const oldPostIndex = updatedPost.findIndex(p => p.id === post.id);
      updatedPost[oldPostIndex] = post;
      this.posts = updatedPost;
      this.postsUpdatd.next([...this.posts]);
    });

  }
}
