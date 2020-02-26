import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XmlDocCaseComponent } from './xml-doc-case.component';

describe('XmlDocCaseComponent', () => {
  let component: XmlDocCaseComponent;
  let fixture: ComponentFixture<XmlDocCaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XmlDocCaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XmlDocCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
