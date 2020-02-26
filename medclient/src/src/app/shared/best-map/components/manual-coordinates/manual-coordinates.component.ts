import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {takeUntil} from "rxjs/operators";
import {BehaviorSubject, Subject} from "rxjs";

@Component({
  selector: 'app-manual-coordinates',
  templateUrl: './manual-coordinates.component.html',
  styleUrls: ['./manual-coordinates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManualCoordinatesComponent implements OnInit, OnChanges, OnDestroy {
@Input() coordinates: any;
@Input() disabled: boolean;
@Output() onSetCoordinates: EventEmitter<any> = new EventEmitter<any>();
@Output() onDeleteCoordinates: EventEmitter<boolean> = new EventEmitter<boolean>();

destroySub: Subject<boolean> = new Subject<boolean>();
form: FormGroup = new FormGroup({
    long: new FormControl(null,{updateOn: "blur"}),
    lat: new FormControl(null,{updateOn: "blur"}),
  });
  constructor() { }

  ngOnInit() {
    this.form.valueChanges.pipe(takeUntil(this.destroySub)).subscribe(
      coo => {
        if (coo && coo.long && coo.lat){
          let geometry = {
            type: 'point',
            coordinates: [coo.long, coo.lat]
          };
          this.onSetCoordinates.emit(geometry)
        }
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes.coordinates)
    this.form.reset(
      {
        long: changes.coordinates.currentValue[0],
        lat: changes.coordinates.currentValue[1]
      }, {emitEvent: false}
    );
    if (changes.disabled)
    changes.disabled.currentValue ? this.form.disable({emitEvent:false}) : this.form.enable({emitEvent:false});
  }

  ngOnDestroy(): void {
    this.destroySub.next(true);
  }

  deleteCoordinates() {
    this.form.reset({}, {emitEvent: false});
    this.onDeleteCoordinates.emit(true);
  }
}
