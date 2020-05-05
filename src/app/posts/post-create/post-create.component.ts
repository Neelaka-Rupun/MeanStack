import { Component, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Post } from '../post.model';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  enteredTite = '';
  enteredContent = '';
  private mode = 'create';
  private postId: string;
  post: Post;


  constructor(
    public postsService: PostService,
    public activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
      this.activatedRoute.paramMap.subscribe((parmMap: ParamMap) => {
        if ( parmMap.has('postId') ) {
          this.mode = 'edit';
          this.postId = parmMap.get('postId');
          this.postsService.getPost(this.postId)
          .subscribe(postData => {
            this.post = { id: postData._id, title: postData.title, content: postData.content}
          })
        } else {
          this.mode = 'create';
          this.postId = null;
        }
      });
    }

    onSavePost(form: NgForm) {
      if (form.invalid) {
        return;
      }
      if (this.mode === 'create') {
        this.postsService.addPost(form.value.title, form.value.content );
      } else {
        this.postsService.updatePost(this.postId, form.value.title, form.value.content );
      }
      form.resetForm();
    }
}
