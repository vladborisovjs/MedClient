import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XmlDocUkioComponent } from './xml-doc-ukio.component';

describe('XmlDocUkioComponent', () => {
  let component: XmlDocUkioComponent;
  let fixture: ComponentFixture<XmlDocUkioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XmlDocUkioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XmlDocUkioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
