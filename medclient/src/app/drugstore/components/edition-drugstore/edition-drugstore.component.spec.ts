import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionDrugstoreComponent } from './edition-drugstore.component';

describe('EditionDrugstoreComponent', () => {
  let component: EditionDrugstoreComponent;
  let fixture: ComponentFixture<EditionDrugstoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditionDrugstoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditionDrugstoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
