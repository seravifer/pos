import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenusService } from '@pos/client/services/menu.service';
import { Menu } from '@pos/models';
import { ControlsOf } from '@pos/client/utils/form-types';

@Component({
  selector: 'pos-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit {
  public id = this.route.snapshot.params['id'];

  public form = new FormGroup<ControlsOf<Partial<Menu>>>({
    name: new FormControl(),
    active: new FormControl(true, { nonNullable: true }),
  });

  constructor(
    private route: ActivatedRoute,
    private menusService: MenusService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.id) {
      this.menusService.getMenu(this.id).subscribe((group) => {
        this.form.patchValue(group);
      });
    }
  }

  onSave() {
    if (this.id) {
      this.menusService.updateMenu(this.form.value).subscribe();
    } else {
      this.menusService.createMenu(this.form.value).subscribe((res) => {
        this.router.navigate([res.id], {
          relativeTo: this.route,
          replaceUrl: true,
        });
      });
    }
  }
}
