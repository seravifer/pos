import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenusService } from '@pos/client/services/menu.service';
import { Menu, Section } from '@pos/models';
import { ControlsOf } from '@pos/client/utils/form-types';
import { SectionsService } from '@pos/client/services/sections.service';

@Component({
  selector: 'pos-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit {
  public id = this.route.snapshot.params['id'];

  public sections: Section[] = [];

  public form = new UntypedFormGroup({
    name: new UntypedFormControl(),
    active: new UntypedFormControl(true, { nonNullable: true }),
    sections: new UntypedFormArray([]),
  });

  get sectionsForm() {
    return this.form.get('sections') as FormArray;
  }

  constructor(
    private route: ActivatedRoute,
    private menusService: MenusService,
    private sectionsService: SectionsService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.id) {
      this.menusService.getMenu(this.id).subscribe((menu) => {
        const { sections, ...data } = menu;
        this.form.patchValue(data);
        sections.forEach((section) => {
          this.sectionsForm.push(
            new FormGroup({
              name: new FormControl(section.name),
              sectionId: new FormControl(section.sectionId),
              maxProducts: new FormControl(section.maxProducts),
            })
          );
        });
      });
    }
    this.sectionsService.getSections().subscribe((sections) => {
      this.sections = sections;
    });
  }

  onAdd() {
    this.sectionsForm.push(
      new FormGroup({
        name: new FormControl(),
        sectionId: new FormControl(),
        maxProducts: new FormControl(),
      })
    );
  }

  onSectionChange(sectionId: string, index: number) {
    const section = this.sections.find((s) => s.id === sectionId);
    const control = this.sectionsForm.controls[index] as FormGroup;
    const value = control.get('name')?.value;
    if (!value || value.length === 0) {
      control.patchValue({
        name: section?.name,
      });
    }
  }

  onSave() {
    if (this.id) {
      this.menusService
        .updateMenu({ id: this.id, ...this.form.value })
        .subscribe();
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
