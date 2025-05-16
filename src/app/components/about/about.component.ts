import { Component, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent implements OnInit {
  constructor(private _viewScroller: ViewportScroller) {}
  ngOnInit() {
    this._viewScroller.scrollToPosition([0, 0]);
  }
}
