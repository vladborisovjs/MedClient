import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TcmkCallsContainerComponent } from './tcmk-calls-container.component';

describe('TcmkCallsContainerComponent', () => {
  let component: TcmkCallsContainerComponent;
  let fixture: ComponentFixture<TcmkCallsContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TcmkCallsContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TcmkCallsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
