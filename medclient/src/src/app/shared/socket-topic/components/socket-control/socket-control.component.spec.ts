import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocketControlComponent } from './socket-control.component';

describe('SocketControlComponent', () => {
  let component: SocketControlComponent;
  let fixture: ComponentFixture<SocketControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocketControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocketControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
