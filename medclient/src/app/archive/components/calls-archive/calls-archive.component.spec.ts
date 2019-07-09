import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallsArchiveComponent } from './calls-archive.component';

describe('CallsArchiveComponent', () => {
  let component: CallsArchiveComponent;
  let fixture: ComponentFixture<CallsArchiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallsArchiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallsArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
