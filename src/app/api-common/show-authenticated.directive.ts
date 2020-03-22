import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthenticationService } from './services';
	
@Directive({ selector: '[appShowAuthenticated]' })
export class ShowAuthenticatedDirective implements OnInit {
	constructor(private templateRef: TemplateRef<any>, private authService: AuthenticationService, private viewContainer: ViewContainerRef)
	{}

	showWhenAuthenticated: boolean;

	ngOnInit() {
		this.authService.isAuthenticated$.subscribe(
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
