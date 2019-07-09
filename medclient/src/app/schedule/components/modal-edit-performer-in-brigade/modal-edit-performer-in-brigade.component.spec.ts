import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditPerformerInBrigadeComponent } from './modal-edit-performer-in-brigade.component';

describe('ModalEditPerformerInBrigadeComponent', () => {
  let component: ModalEditPerformerInBrigadeComponent;
  let fixture: ComponentFixture<ModalEditPerformerInBrigadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEditPerformerInBrigadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditPerformerInBrigadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
