import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router';
import {filter} from 'rxjs/internal/operators';
import {cloneDeep, isEmpty} from 'lodash';

interface IBreadcrumb {
  label: string;
  queryParams?: Params;
  matrixParams?: Params;
  url?: any[];
}

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {
  public breadcrumbs: IBreadcrumb[];

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    this.breadcrumbs = [];
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    )
      .subscribe(event => {
        this.breadcrumbs = [];
        const root: ActivatedRoute = this.activatedRoute.root;
        // this.breadcrumbs = this.getBreadcrumbs(root).filter(breadcrumb => breadcrumb.label);
        this.getBreadcrumbs(root);
      });

  }

  ngOnInit() {
  }

  private getBreadcrumbs(route: ActivatedRoute, url: any[] = ['/']) {
    const ROUTE_DATA_BREADCRUMB = 'title';
    const ROUTE_DATA_MATRIX_PARAMS = 'matrixParams';

    // добавляем урлку по path роута
    const tempUrl = route.snapshot.url.map(segment => segment.path).join('/');
    if (tempUrl) {
      url.push(tempUrl);
    }

    // смотрим и добавляем только те матричные параметры,
    // что указаны в ROUTE_DATA_MATRIX_PARAMS текущего роута
    if (route.snapshot.data.hasOwnProperty(ROUTE_DATA_MATRIX_PARAMS) && route.snapshot.data[ROUTE_DATA_MATRIX_PARAMS]) {
      let matParamsData = route.snapshot.data[ROUTE_DATA_MATRIX_PARAMS];
      let matParams = {};
      matParamsData.forEach(el => {
        if (route.snapshot.params.hasOwnProperty(el)) {
          matParams[el] = route.snapshot.params[el];
        }
      });
      if (!isEmpty(matParams)) {
        url.push(matParams);
      }
    }

    if (route.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB) && route.snapshot.data[ROUTE_DATA_BREADCRUMB]) {
      let brdc: IBreadcrumb = {
        label: route.snapshot.data[ROUTE_DATA_BREADCRUMB],
        url: [...url]
      };
      this.breadcrumbs.push(cloneDeep(brdc));
    }
    if (route.firstChild) {
      this.getBreadcrumbs(route.firstChild, url);
    }
  }

}
