import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCallJournalComponent } from './modal-call-journal.component';

describe('ModalCallJournalComponent', () => {
  let component: ModalCallJournalComponent;
  let fixture: ComponentFixture<ModalCallJournalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCallJournalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCallJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
