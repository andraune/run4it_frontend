import {
    Directive,
    Input,
    OnInit,
    TemplateRef,
    ViewContainerRef
  } from '@angular/core';
  
  import { UserService } from './services';
  
  @Directive({ selector: '[appShowAuthenticated]' })
  export class ShowAuthenticatedDirective implements OnInit {
    constructor(
      private templateRef: TemplateRef<any>,
      private userService: UserService,
      private viewContainer: ViewContainerRef
    ) {}
  
    showWhenAuthenticated: boolean;
  
    ngOnInit() {
      this.userService.isAuthenticatedObservable.subscribe(
        (isAuthenticated) => {
          this.viewContainer.clear();
          if (isAuthenticated && this.showWhenAuthenticated || !isAuthenticated && !this.showWhenAuthenticated) {
            this.viewContainer.createEmbeddedView(this.templateRef);
          }
        }
      );
    }
  
    @Input() set appShowAuthenticated(showWhenAuthed: boolean) {
      this.showWhenAuthenticated = showWhenAuthed;
    }
  }
  