import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsArchiveComponent } from './patients-archive.component';

describe('PatientsArchiveComponent', () => {
  let component: PatientsArchiveComponent;
  let fixture: ComponentFixture<PatientsArchiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientsArchiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientsArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
