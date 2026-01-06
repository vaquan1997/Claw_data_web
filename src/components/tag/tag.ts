import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export type TagColor = 'default' | 'primary' | 'success' | 'warning' | 'error';
export type TagSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tag.html',
  styleUrl: './tag.scss',
})
export class TagComponent {
  @Input() content: string = 'tag';
  @Input() color: TagColor = 'default';
  @Input() size: TagSize = 'medium';
  @Input() closable: boolean = false;

  @Output() close = new EventEmitter<void>();

  onClose(event: Event): void {
    event.stopPropagation();
    this.close.emit();
  }
}
