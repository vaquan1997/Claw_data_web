import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InputComponent } from '../components/input/input';
import { TagComponent } from '../components/tag/tag';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,InputComponent,TagComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('user-manager');
}
