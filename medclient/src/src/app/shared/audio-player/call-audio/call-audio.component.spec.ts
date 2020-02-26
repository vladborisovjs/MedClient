import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallAudioComponent } from './call-audio.component';

describe('CallAudioComponent', () => {
  let component: CallAudioComponent;
  let fixture: ComponentFixture<CallAudioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallAudioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
