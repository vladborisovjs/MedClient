import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsForDrugsComponent } from './requests-for-drugs.component';

describe('RequestsForDrugsComponent', () => {
  let component: RequestsForDrugsComponent;
  let fixture: ComponentFixture<RequestsForDrugsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestsForDrugsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestsForDrugsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
