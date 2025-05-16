import { Component, OnInit, ValueSansProvider } from '@angular/core';
import { ViewportScroller } from '@angular/common';
@Component({
  selector: 'app-start-here',
  standalone: false,
  templateUrl: './start-here.component.html',
  styleUrl: './start-here.component.css',
})
export class StartHereComponent implements OnInit {
  constructor(private _viewPortScroller: ViewportScroller) {}
  ngOnInit() {
    this._viewPortScroller.scrollToPosition([0, 0]);
  }
}
