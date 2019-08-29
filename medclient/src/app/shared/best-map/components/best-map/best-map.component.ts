import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {IMapParams, MapManager} from '../..//models/map-manager';
import {LayersService} from '../../services/layers.service';

@Component({
  selector: 'app-best-map',
  templateUrl: './best-map.component.html',
  styleUrls: ['./best-map.component.scss']
})
export class BestMapComponent implements OnChanges, AfterViewInit, OnDestroy {
  @ViewChild('mapView') mapView: ElementRef;
  @Input() mapParams: IMapParams;
  @Input() controls: any[];
  @Output() onMapCreated = new EventEmitter<MapManager>();
  mapMan: MapManager;

  constructor(private ls: LayersService) {
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      this.mapMan = MapManager.makeMap(this.mapView, this.mapParams, this.ls.getDefaultLayers(), this.controls);
      this.onMapCreated.emit(this.mapMan);
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {
  }

}
