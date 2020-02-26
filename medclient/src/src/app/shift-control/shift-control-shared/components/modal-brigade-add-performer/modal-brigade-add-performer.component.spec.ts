import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBrigadeAddPerformerComponent } from './modal-brigade-add-performer.component';

describe('ModalBrigadeAddPerformerComponent', () => {
  let component: ModalBrigadeAddPerformerComponent;
  let fixture: ComponentFixture<ModalBrigadeAddPerformerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBrigadeAddPerformerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBrigadeAddPerformerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
