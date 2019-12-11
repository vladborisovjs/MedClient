import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XmlDocPatientComponent } from './xml-doc-patient.component';

describe('XmlDocComponent', () => {
  let component: XmlDocPatientComponent;
  let fixture: ComponentFixture<XmlDocPatientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XmlDocPatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XmlDocPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
