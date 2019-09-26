import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugBagTemplatesListComponent } from './drug-bag-templates-list.component';

describe('DrugBagTemplatesListComponent', () => {
  let component: DrugBagTemplatesListComponent;
  let fixture: ComponentFixture<DrugBagTemplatesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugBagTemplatesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugBagTemplatesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
