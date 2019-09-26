import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {SearchAddressService} from '../../services/search-address.service';
import {interval, Subject, Subscription} from 'rxjs';
import {debounce, debounceTime} from 'rxjs/operators';
import {BuildingBean, StreetBean} from '../../../../../../swagger/med-api.service';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-full-address',
  templateUrl: './full-address.component.html',
  styleUrls: ['./full-address.component.scss']
})
export class FullAddressComponent implements OnInit, OnDestroy {
  @Input() valueStreet; //  адреса
  @Input() valueBuilding; // номер дома
  @Input() disabled = false;
  @Input() form: FormGroup;
  @Output() setPolygon = new EventEmitter(); // кординаты выбранного дома

  sbscs: Subscription[] = [];

  loadingStreets = false;
  loadingBuilding = false;
  streets: StreetBean[] = [];
  buildings: BuildingBean[] = [];
  streetSearchSub: Subject<string> = new Subject<string>();

  constructor(private searchService: SearchAddressService) {
  }

  ngOnInit() {
    let formDis = this.form.disabled;
    this.form.addControl('address', new FormControl(this.valueStreet));
    this.form.addControl('houseNum', new FormControl(this.valueBuilding));
    if (formDis){
      this.form.disable({emitEvent: false});
    }
    this.sbscs.push(
      this.form.controls['address'].valueChanges.subscribe(
        ch=>{
          if (!ch){
            this.form.controls['houseNum'].setValue(null, {emitEvent: false});
            this.buildings = [];
            this.valueBuilding = null;
          }
        }
      ),
      this.streetSearchSub.asObservable().pipe(debounceTime(500)).subscribe(
        s => {
          this.searchStreet(s);
        }
      )
    );
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }

  onSearchStreet(e) {
    if (e.term && e.term != '') {
      this.streetSearchSub.next(e.term);
    } else {
      this.streets = [];
    }
  }

  searchStreet(q) {
    this.loadingStreets = true;
    this.searchService.searchStreet(q).subscribe(
      res => {
        this.loadingStreets = false;
        this.streets = res;
      }
    );
  }

  onSelectStreet(e) {
    if (e) {
      this.loadingBuilding = true;
      this.searchService.searchBuilding(e.cityAddress, e.name).subscribe(
        b => {
          this.loadingBuilding = false;
          this.buildings = b;
        }
      );
    }
  }

  search() {
    return true;
  }

  searchBuilding(q, item: BuildingBean) {
    return !!item.houseNumber.includes(q);
  }

  onSelectBuilding(e) {
    this.setPolygon.emit(e);
  }


}
