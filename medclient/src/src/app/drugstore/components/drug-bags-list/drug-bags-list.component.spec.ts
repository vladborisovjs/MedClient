import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugBagsListComponent } from './drug-bags-list.component';

describe('DrugBagsListComponent', () => {
  let component: DrugBagsListComponent;
  let fixture: ComponentFixture<DrugBagsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugBagsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugBagsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
