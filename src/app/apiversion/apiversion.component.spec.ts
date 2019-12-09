import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiversionComponent } from './apiversion.component';

describe('ApiversionComponent', () => {
  let component: ApiversionComponent;
  let fixture: ComponentFixture<ApiversionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiversionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
