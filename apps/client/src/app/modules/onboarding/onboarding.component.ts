import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@pos/client/services/auth.service';
import { UsersService } from '@pos/client/services/users.service';
import { IUser } from '@pos/models';

@Component({
  selector: 'pos-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent {
  public users$ = this.usersService.getUsers();

  public pin = 0;
  public pass = '';
  public selectedUser: IUser | null = null;
  public showNumberPad = false;

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private router: Router
  ) {}

  onSelectUser(user: IUser) {
    this.selectedUser = user;
    this.showNumberPad = true;
  }

  onSelectPin(pin: number) {
    console.log(pin);
    this.pass = pin.toString();
    if (this.pass.length === 4) {
      this.authService.authenticate(this.selectedUser!.id, this.pass).subscribe({
        next: () => {
          this.router.navigate(['/terminal']);
        },
        error: () => {
          this.pass = '';
          this.pin = 0;
        },
      });
    }
  }
}
