import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUsersItemComponent } from './admin-users-item.component';

describe('AdminUsersItemComponent', () => {
  let component: AdminUsersItemComponent;
  let fixture: ComponentFixture<AdminUsersItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUsersItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUsersItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
