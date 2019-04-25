import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagingDrugstoreComponent } from './managing-drugstore.component';

describe('ManagingDrugstoreComponent', () => {
  let component: ManagingDrugstoreComponent;
  let fixture: ComponentFixture<ManagingDrugstoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagingDrugstoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagingDrugstoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
