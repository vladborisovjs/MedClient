import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { F110ArchiveComponent } from './f110-archive.component';

describe('F110ArchiveComponent', () => {
  let component: F110ArchiveComponent;
  let fixture: ComponentFixture<F110ArchiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ F110ArchiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(F110ArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
