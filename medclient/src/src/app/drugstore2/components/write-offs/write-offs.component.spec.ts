import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteOffsComponent } from './write-offs.component';

describe('MovementsComponent', () => {
  let component: WriteOffsComponent;
  let fixture: ComponentFixture<WriteOffsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteOffsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteOffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
