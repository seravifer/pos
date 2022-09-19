import { Component, OnInit } from '@angular/core';
import { UsersService } from '@pos/client/services/users.service';
import { IUser } from '@pos/models';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'pos-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: IUser[] = [];
  user: Partial<IUser> = {};
  selectedUsers: IUser[] | null = null;
  userDialog = false;
  submitted = false;

  constructor(
    private usersService: UsersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.usersService.getUsers().subscribe((data) => (this.users = data));
  }

  openNew() {
    this.user = {};
    this.submitted = false;
    this.userDialog = true;
  }

  deleteSelectedUsers() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected users?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedUsers?.forEach((user) => {
          this.usersService.deleteUser(user).subscribe();
        });
        this.users = this.users.filter(
          (val) => !this.selectedUsers?.includes(val)
        );
        this.selectedUsers = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Users Deleted',
          life: 3000,
        });
      },
    });
  }

  editUser(user: IUser) {
    this.user = { ...user };
    this.userDialog = true;
  }

  deleteUser(user: IUser) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + user.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usersService.deleteUser(user).subscribe();
        this.users = this.users.filter((val) => val.id !== user.id);
        this.user = {};

        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'User Deleted',
          life: 3000,
        });
      },
    });
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  saveUser() {
    this.submitted = true;

    if (this.user?.name?.trim()) {
      if (this.user.id) {
        this.users[this.findIndexById(this.user.id)] = this.user as IUser;
        this.usersService.updateUser(this.user as IUser).subscribe();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'User Updated',
          life: 3000,
        });
      } else {
        this.users.push(this.user as IUser);
        this.usersService.createUser(this.user as IUser).subscribe();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'User Created',
          life: 3000,
        });
      }

      this.users = [...this.users];
      this.userDialog = false;
      this.user = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }
}
