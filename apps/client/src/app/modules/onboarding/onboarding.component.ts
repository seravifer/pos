import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@pos/client/services/auth.service';
import { ILoginUser } from '@pos/models';

@Component({
  selector: 'pos-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent {
  public users$ = this.authService.getUsers();

  public pin = 0;
  public pass = '';
  public selectedUser: ILoginUser | null = null;
  public showNumberPad = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSelectUser(user: ILoginUser) {
    this.selectedUser = user;
    this.showNumberPad = true;
  }

  onSelectPin(pin: number) {
    this.pass = pin.toString();
    if (this.pass.length === 4) {
      this.authService.login(this.selectedUser!.id, this.pass).subscribe({
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
