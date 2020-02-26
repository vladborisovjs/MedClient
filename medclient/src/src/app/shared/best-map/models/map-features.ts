import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Point from 'ol/geom/Point';
import {fromLonLat} from 'ol/proj';
import {TransportMonitoringData} from "../../../../../swagger/med-api.service";


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

  protected createFeature(coordinates, obj, rotation?): Feature{
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
    // src: this.iconPath + 'hospital-regular.svg',
    src: this.iconPath + 'hospital.svg',
    // imgSize: [20, 20],
    // color: '#125ec2',
    scale: 0.06,
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
    src: this.iconPath + 'phone-on-circle.png',
    scale: 0.06,
    anchor: [0.36, 1],
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

export class TransportLayer extends MedMapFeatureVectorLayer{
  /** статусы бригад*/
  // RETURNING // Возвращение с вызова
  // DELAY // Задержка в пути
  // FUEL // Заправка топлива
  // DEFECTED // Машина неисправна
  // WORK // На вызове
  // SELECT // Назначена
  // ACTIVE_CALLS // Незавершенные вызовы
  // OFFLINE // Не на линии
  // HELPING // Оказание помощи
  // ALARM // Подан сигнал тревоги
  // REFILL // Пополнение запасов
  // IN_HOSPITAL // Прибыла в стационар
  // ARRIVED // Прибыла на вызов
  // CONFIRMED // Приняла вызов
  // FREE // Свободна
  // FREE_ON_BASE // Свободна на станции
  // HOSPITALIZATION // Транспортировка



  getIconOptions(status){
    let iconOptions = {
      src: this.iconPath ,
      scale: 0.1,
    };
    switch (status) {
      case 'FREE':
      case 'FREE_ON_BASE':
      case 'RETURNING':
        iconOptions.src += 'ambulance-top-green.png';
        break;
      case 'SELECT':
      case 'DELAY':
      case 'FUEL':
      case 'ACTIVE_CALLS':
      case 'REFILL':
        iconOptions.src += 'ambulance-top-yellow.png';
        break;
      case 'WORK':
      case 'HELPING':
      case 'IN_HOSPITAL':
      case 'ARRIVED':
      case 'CONFIRMED':
      case 'HOSPITALIZATION':
        iconOptions.src += 'ambulance-blue.png';
        break;
      case 'ALARM':
      case 'DEFECTED':
        iconOptions.src += 'ambulance-top-red.png';
        break;
      default:
        iconOptions.src += 'ambulance-top.png';
    }
    return iconOptions;
  }
  constructor(mapProjection){
    super(mapProjection);
    // this.iconStyle = new Style({image: new Icon(this.iconOptions)});
  }
  protected createFeature(coordinates, transport:TransportMonitoringData, rotation){
    const feature = new Feature(
      {
        geometry: new Point(coordinates),
        featureType: 'transport',
        transport: transport
      }
    );
    let iconStyle = new Style({image: new Icon(this.getIconOptions(transport.brigadeContainer.brigade.brigadeStatusFK.code))});
    iconStyle.getImage().setRotation((rotation - 90)*(Math.PI/180));
    feature.setStyle(iconStyle);
    return feature;
  }

  public resetFeatures(obj: TransportMonitoringData[]){
    this.removeAllFeatures();
    obj.forEach(
      o=> {
        let coordinates = fromLonLat(JSON.parse(o.transportMonitoringBean.location)['coordinates'], this.mapProjection);
        if (!!coordinates[0] && !!coordinates[1]){
          let feature = this.createFeature(coordinates, o, o.transportMonitoringBean.direction);
          this.features.push(feature);
          this.source.addFeature(feature);
        }
      }
    );
  }

}
