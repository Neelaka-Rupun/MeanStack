// import { Component, OnInit } from '@angular/core';
// import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Post } from '../post.model';
import { PostService } from '../posts.service';
import { mineType } from './mime-type.validator';


// import { Post } from '../post.model';
// import { mineType } from './mime-type.validator';
// import { PostService } from '../posts.service';



// @Component({
//   selector: 'app-post-create',
//   templateUrl: './post-create.component.html',
//   styleUrls: ['./post-create.component.css']
// })
// export class PostCreateComponent implements OnInit {

//   enteredTite = '';
//   enteredContent = '';
//   private mode = 'create';
//   private postId: string;
//   form: FormGroup;
//   post: Post;
//   imagePreview: string;
//   private isLoading = false;


//   constructor(
//     public postsService: PostService,
//     public activatedRoute: ActivatedRoute
//   ) { }

//   ngOnInit() {
//     this.form = new FormGroup({
//       title: new FormControl(null, {
//         validators: [
//           Validators.required,
//           Validators.min(3)
//         ]
//       }),
//       content: new FormControl(null, {
//         validators: [
//           Validators.required,
//           Validators.min(3)
//         ]
//       }),
//       image : new FormControl( null , {
//         validators: [
//           Validators.required
//         ], asyncValidators: [mineType]
//       })
//     });
//     this.activatedRoute.paramMap.subscribe((parmMap: ParamMap) => {
//       if (parmMap.has('postId')) {
//         this.mode = 'edit';
//         this.postId = parmMap.get('postId');
//         this.isLoading = true;
//         this.postsService.getPost(this.postId)
//           .subscribe(postData => {
//             this.isLoading = false;
//             this.post = {
//               id: postData._id,
//               title: postData.title,
//               content: postData.content,
//               imagePath: postData.imagePath
//             };
//             this.form.setValue({
//               title: this.post.title,
//               content: this.post.content,
//               image: this.post.imagePath
//             });
//           });
//       } else {
//         this.mode = 'create';
//         this.postId = null;
//       }
//     });
//   }

//   onSavePost() {
//     if (this.form.invalid) {
//       return;
//     }
//     this.isLoading = true;
//     if (this.mode === 'create') {
//       this.postsService.addPost(
//         this.form.value.title,
//         this.form.value.content,
//         this.form.value.image
//         );
//     } else {
//       this.postsService.updatePost(
//         this.postId,
//         this.form.value.title,
//         this.form.value.content,
//         this.form.value.image
//         );
//     }
//     this.form.reset();
//   }

//   onImagePicked(event: Event) {
//     const file = (event.target as HTMLInputElement).files[0];
//     this.form.patchValue({ image: file});
//     this.form.get('image').updateValueAndValidity();
//     const reader  = new FileReader();
//     reader.onload = () => {
//       this.imagePreview = reader.result as string;
//     };
//     reader.readAsDataURL(file);
//   }

// }


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
  form: FormGroup;
  post: Post;
  imagePreview: string;
  private isLoading = false;


  constructor(
    public postsService: PostService,
    public activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.min(3)
        ]
      }),
      content: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.min(3)
        ]
      }),
      image : new FormControl( null , {
        validators: [
          Validators.required
        ], asyncValidators: [mineType]
      })
    });
    this.activatedRoute.paramMap.subscribe((parmMap: ParamMap) => {
      if (parmMap.has('postId')) {
        this.mode = 'edit';
        this.postId = parmMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId)
          .subscribe(postData => {
            this.isLoading = false;
            this.post = {
              id: postData._id,
              title: postData.title,
              content: postData.content,
              imagePath: postData.imagePath
            };
            this.form.setValue({
              title: this.post.title,
              content: this.post.content,
              image: this.post.imagePath
            });
          });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
        );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
        );
    }
    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file});
    this.form.get('image').updateValueAndValidity();
    const reader  = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

}
