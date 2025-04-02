import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SplineViewerComponent } from './Components/spline-viewer/spline-viewer.component';

@Component({
  selector: 'app-root',
  imports: [ SplineViewerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'myapp';
}
