import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Point from 'ol/geom/Point';
import {fromLonLat} from 'ol/proj';


export abstract class MedMapFeatureVectorLayer {
  source: VectorSource;
  layer: VectorLayer;
  features: Feature[] = []; // массив фич, привязанных к векторсорсу
  iconStyle: Style;
  mapProjection: string;

  iconPath = 'assets/icons/';

  protected constructor(mapProjection?) {
    this.source = new VectorSource({});
    this.layer = new VectorLayer({source: this.source});
    this.mapProjection = mapProjection;
  }

  protected createFeature(coordinates, obj): Feature{
    return;
  }

  public removeAllFeatures(){
    this.features.forEach(f => this.source.removeFeature(f));
    this.features = [];
  }

  public resetFeatures(obj: any[]){
    this.removeAllFeatures();
    obj.forEach(
      o=> {
        let coordinates = fromLonLat(JSON.parse(o.location)['coordinates'], this.mapProjection);
        if (!!coordinates[0] && !!coordinates[1]){
          let feature = this.createFeature(coordinates, o);
          this.features.push(feature);
          this.source.addFeature(feature);
        }
      }
    );
  }
}

export class SubdivisonLayer extends MedMapFeatureVectorLayer {
  iconOptions = {
    // src: this.apiUrl + '/assets/icons/clinic-medical-solid.svg',
    src: this.iconPath + 'hospital-regular.svg',
    imgSize: [20, 20],
    color: '#125ec2',
    anchor: [0.36, 1],
    // anchor: [0.8, 0.8],
  };

  constructor(mapProjection) {
    super(mapProjection);
    this.iconStyle = new Style({image: new Icon(this.iconOptions)});
  }

  protected createFeature(coordinates, sub){
    const feature = new Feature(
      {
        geometry: new Point(coordinates),
        featureType: 'subdivision',
        subdivision: sub,
      }
    );
    feature.setStyle(this.iconStyle);
    return feature;
  }
}

export class CallLayer extends MedMapFeatureVectorLayer {
  iconOptions = {
    // src: this.apiUrl + '/assets/icons/clinic-medical-solid.svg',
    src: this.iconPath + 'phone-alt-solid.svg',
    imgSize: [20, 20],
    color: '#841519',
    anchor: [0.36, 1],
    // anchor: [0.8, 0.8],
  };

  constructor(mapProjection) {
    super(mapProjection);
    this.iconStyle = new Style({image: new Icon(this.iconOptions)});
  }

  protected createFeature(coordinates, call){
    const feature = new Feature(
      {
        geometry: new Point(coordinates),
        featureType: 'call',
        call: call
      }
    );
    feature.setStyle(this.iconStyle);
    return feature;
  }
}

export class PointerLayer extends MedMapFeatureVectorLayer{
  iconOptions = {
    src: this.iconPath + 'map-marker-alt-solid.svg',
    imgSize: [20, 20],
    color: '#aa0011',
    anchor: [0.36, 1],
  };
  constructor() {
    super();
    this.iconStyle = new Style({image: new Icon(this.iconOptions)});
  }

  resetFeatures(obj = []){
    this.removeAllFeatures();
  }

  setPointFeature(coordinate){
    this.removeAllFeatures();
    let feature = new Feature({geometry: new Point(coordinate)});
    feature.setStyle(this.iconStyle);
    this.features.push(feature);
    this.source.addFeature(feature);
  }
}

