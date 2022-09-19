import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenusService } from '@pos/client/services/menu.service';
import { ISection } from '@pos/models';
import { SectionsService } from '@pos/client/services/sections.service';

@Component({
  selector: 'pos-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit {
  public id = this.route.snapshot.params['id'];

  public sections: ISection[] = [];

  public form = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    price: new FormControl(0, { nonNullable: true }),
    active: new FormControl(true, { nonNullable: true }),
    sections: new FormArray([]),
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
              name: new FormControl(section.name, { nonNullable: true }),
              sectionId: new FormControl(section.sectionId, {
                nonNullable: true,
              }),
              maxProducts: new FormControl(section.maxProducts, {
                nonNullable: true,
              }),
            })
          );
        });
      });
    }
    this.sectionsService.getSections().subscribe((sections) => {
      this.sections = sections;
    });
  }

  add() {
    this.sectionsForm.push(
      new FormGroup({
        name: new FormControl('', { nonNullable: true }),
        sectionId: new FormControl(),
        maxProducts: new FormControl(1, { nonNullable: true }),
      })
    );
  }

  deleteSection(index: number) {
    this.sectionsForm.removeAt(index);
  }

  sectionChange(sectionId: string, index: number) {
    const section = this.sections.find((s) => s.id === sectionId);
    const control = this.sectionsForm.controls[index] as FormGroup;
    const value = control.get('name')?.value;
    if (!value || value.length === 0) {
      control.patchValue({
        name: section?.name,
      });
    }
  }

  save() {
    if (this.id) {
      this.menusService
        .updateMenu({ id: this.id, ...this.form.getRawValue() })
        .subscribe();
    } else {
      this.menusService.createMenu(this.form.getRawValue()).subscribe((res) => {
        this.router.navigate([res.id], {
          relativeTo: this.route,
          replaceUrl: true,
        });
      });
    }
  }
}
