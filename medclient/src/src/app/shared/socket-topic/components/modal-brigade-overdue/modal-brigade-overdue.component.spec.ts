import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBrigadeOverdueComponent } from './modal-brigade-overdue.component';

describe('ModalBrigadeOverdueComponent', () => {
  let component: ModalBrigadeOverdueComponent;
  let fixture: ComponentFixture<ModalBrigadeOverdueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBrigadeOverdueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBrigadeOverdueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
