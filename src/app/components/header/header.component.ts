import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  viewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  role = '';
  menuOpen = false;
  userid = '';

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  @ViewChild('navToggeler') btn!: ElementRef;
  isloged: boolean = false;
  constructor(private auth: AuthService, private _router: Router) {}
  ngOnInit() {
    this.role = localStorage.getItem('role') ?? '';
    this.userid = localStorage.getItem('userId') ?? '';

    if (this.userid != '') {
      this.isloged = true;
    }
  }
  logout() {
    this.isloged = false;
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    this.auth.setLoggedIn(false);
    this.auth.loggedUser = null;
    this.auth.loggedUserId = null;
  }
  GoToProfile() {
    this._router.navigateByUrl(`UserProfile/${this.userid}`);
  }
}
