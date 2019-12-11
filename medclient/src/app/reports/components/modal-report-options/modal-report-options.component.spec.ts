import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalReportOptionsComponent } from './modal-report-options.component';

describe('ModalReportOptionsComponent', () => {
  let component: ModalReportOptionsComponent;
  let fixture: ComponentFixture<ModalReportOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalReportOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalReportOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
