import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';
@Injectable({providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postsUpdatd = new Subject<Post[]>();

  getPosts() {
    return [...this.posts];
  }
  getPostUpdateListener() {
   return this.postsUpdatd.asObservable();
  }
  addPost(title: string, content: string) {
    const post: Post = { title, content };
    this.posts.push(post);
    this.postsUpdatd.next([...this.posts]);
  }
}
