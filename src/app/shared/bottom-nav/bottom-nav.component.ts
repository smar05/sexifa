import { FontAwesomeIconsService } from './../font-awesome-icons/font-awesome-icons.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.css'],
})
export class BottomNavComponent implements OnInit {
  constructor(public fontAwesomeIconsService: FontAwesomeIconsService) {}

  ngOnInit(): void {}
}
