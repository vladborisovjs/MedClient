import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Subject, Subscription} from "rxjs";
import {BuildingBean, StreetBean} from "../../../../../../swagger/med-api.service";
import {SearchAddressService} from "../../services/search-address.service";
import {debounceTime, take} from "rxjs/operators";

@Component({
  selector: 'app-full-address-fias',
  templateUrl: './full-address-fias.component.html',
  styleUrls: ['./full-address-fias.component.scss']
})
export class FullAddressFiasComponent implements OnInit {

  @Input() valueStreet; //  адреса
  @Input() valueBuilding; // номер дома
  @Input() disabled = false;
  @Input() form: FormGroup;
  @Output() setPolygon = new EventEmitter(); // кординаты выбранного дома

  sbscs: Subscription[] = [];

  loadingStreets = false;
  loadingBuilding = false;
  streets: StreetBean[] | any[] = [];
  buildings: BuildingBean[] | any[] = [];
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
    console.log('.....', q);
    this.loadingStreets = true;
    this.searchService.searchStreetFIAS(q).subscribe(
      res => {
        console.log(res.list);
        this.loadingStreets = false;
        this.streets = res.list;
      }
    );
  }

  onSelectStreet(e: any) {
    if (e.id) { // если не улица новая то не ищем дома
      this.loadingBuilding = true;
      this.searchService.getCoordinatesStreet(e.id).pipe(take(1)).subscribe(
        c =>
        {
          let parsed = JSON.parse(c);
          if (parsed && parsed.coordinates && parsed.coordinates[0] !== null){
            this.setPolygon.emit(c); console.log('==>', c) //todo: разкоментить
          }
    }
      );
      this.searchService.searchHouseFIAS(e.id).subscribe(
        b => {
          console.log('******', b.list);
          this.loadingBuilding = false;
          this.buildings = b.list;
        }
      );
    }
  }

  addStreet(e){
    console.log('added', {addressCropped: e});
    return {addressCropped: e};
  }

  search() {
    return true;
  }

  searchBuilding(q, item: BuildingBean) {
    return !!item.houseNumber.includes(q);
  }

  onSelectBuilding(e) {
    this.searchService.getCoordinatesHouse(e.id).pipe(take(1)).subscribe(
      c =>  {
        let parsed = JSON.parse(c);
        if (parsed && parsed.coordinates && parsed.coordinates[0] !== null){
          this.setPolygon.emit(c); console.log('==>', c) //todo: разкоментить
        }

      }
    );
  }

  addBuilding(e){
    console.log('added', {nameFull: e});
    return {nameFull: e};
  }


}
