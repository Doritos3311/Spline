import { Component, OnInit, ElementRef, Input, OnDestroy } from '@angular/core';
import { Motion } from '@capacitor/motion';

@Component({
  selector: 'app-spline-viewer',
  templateUrl: './spline-viewer.component.html',
  styleUrls: ['./spline-viewer.component.scss']
})
export class SplineViewerComponent implements OnInit, OnDestroy {
  @Input() sceneUrl: string = '';

  constructor(private elementRef: ElementRef) { }

  async ngOnInit(): Promise<void> {
    await this.loadSplineViewer();
    await this.setupMotion();
  }

  private async loadSplineViewer() {
    // Carga dinámica del módulo para evitar problemas con SSR
    const { SplineViewer } = await import('@splinetool/viewer');

    const container = this.elementRef.nativeElement;
    container.innerHTML = `
      <spline-viewer 
        url="${this.sceneUrl}" 
        loading-anim-type="spinner-small-dark"
      ></spline-viewer>
    `;
  }

  private async setupMotion() {
    Motion.addListener('orientation', (event) => {
      const viewer = document.querySelector('spline-viewer') as any;
      if (!viewer) return;

      // Ajusta estos valores para cambiar la sensibilidad
      const panX = event.gamma / 20;  // Movimiento horizontal
      const panY = event.beta / 30;   // Movimiento vertical

      viewer.cameraTarget = {
        x: panX,
        y: panY,
        z: 0
      };
    });
  }

  ngOnDestroy(): void {
    Motion.removeAllListeners();
  }
}