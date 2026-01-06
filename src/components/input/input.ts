import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input',
  standalone: true,
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class InputComponent {
  @Input() type: HTMLInputElement['type'] = 'text';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() name = '';
  @Input() value = '';
  @Input() min?: string;
  @Input() max?: string;
  @Input() step?: string;
  @Input() pattern?: string;
  @Input() autocomplete?: string;
}
