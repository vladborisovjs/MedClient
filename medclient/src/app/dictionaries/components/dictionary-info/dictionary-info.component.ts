import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IDictionaryInfo} from '../../models/dictionary-structure';
import {TreeNode} from 'primeng/api';

@Component({
  selector: 'app-dictionary-info',
  templateUrl: './dictionary-info.component.html',
  styleUrls: ['./dictionary-info.component.scss']
})
export class DictionaryInfoComponent implements OnInit {
  dList: any[];
  dict: IDictionaryInfo;
  tree: TreeNode[];

  constructor(private route: ActivatedRoute,
              private router: Router,) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      console.log(data);
      this.dict = data.itemWithList.dict;
      if (this.dict.type === 'tree') {
        this.tree = [this.prepareNodes(data.itemWithList.list[0])];
      } else if (this.dict.type === 'list') {
        this.dList = data.itemWithList.list;
      }
    });

  }

  goToItem(e) {
    this.router.navigate([e.data.id], {relativeTo: this.route});
  }

  createItem() {
    this.router.navigate([0], {relativeTo: this.route});
  }

  private prepareNodes(tn) {
    tn.data = {};
    tn.data.name = tn.text;
    tn.data.id = tn.id;
    if (tn.items) {
      tn.children = tn.items;
      delete tn.items;
      tn.children.forEach(el => {
        el = this.prepareNodes(el);
      });
    }
    return tn;
  }
}
