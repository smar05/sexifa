import { Component, Input } from '@angular/core';

export interface IButtonComponent {
  type?: string;
  class: string;
  disabled?: boolean;
  text: string;
  style?: string;
  id?: string;
}

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  @Input() properties: IButtonComponent = {
    type: null,
    class: null,
    disabled: false,
    text: null,
    style: null,
    id: null,
  };
}
