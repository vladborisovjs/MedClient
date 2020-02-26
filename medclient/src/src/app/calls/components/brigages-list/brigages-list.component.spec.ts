import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrigagesListComponent } from './brigages-list.component';

describe('BrigagesListComponent', () => {
  let component: BrigagesListComponent;
  let fixture: ComponentFixture<BrigagesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrigagesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrigagesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
