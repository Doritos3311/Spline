import { Component, OnInit, OnDestroy, ElementRef, Input } from '@angular/core';
import { Motion } from '@capacitor/motion';

@Component({
  selector: 'app-spline-viewer',
  templateUrl: './spline-viewer.component.html',
  styleUrls: ['./spline-viewer.component.scss']
})
export class SplineViewerComponent implements OnInit, OnDestroy {
  @Input() sceneUrl: string = '';
  private viewer: any;
  private isIos = false;
  private motionActive = false;
  private deviceOrientationHandler: ((this: Window, ev: DeviceOrientationEvent) => any) | null = null;

  constructor(private elementRef: ElementRef) {
    this.isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  async ngOnInit() {
    await this.loadSplineViewer();
    await this.initMotion();
  }

  private async loadSplineViewer() {
    const { SplineViewer } = await import('@splinetool/viewer');
    const container = this.elementRef.nativeElement;
    container.innerHTML = `<spline-viewer url="${this.sceneUrl}"></spline-viewer>`;
    this.viewer = container.querySelector('spline-viewer');
    
    this.viewer.addEventListener('load', () => {
      this.setInitialCameraPosition();
    });
  }

  private setInitialCameraPosition() {
    if (this.viewer) {
      try {
        this.viewer.setAttribute('camera', 'Camera 2');
      } catch (e) {
        console.log('Usando cámara por defecto');
      }
      
      this.viewer.cameraPosition = { x: 0, y: 0, z: 5 };
      this.viewer.cameraTarget = { x: 0, y: 0, z: 0 };
    }
  }

  private async initMotion() {
    try {
      if (this.isIos) {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission !== 'granted') {
          this.setupMouseControls();
          return;
        }
      }

      // Opción 1: Usando Capacitor Motion
      Motion.addListener('orientation', (event) => {
        this.handleDeviceMotion(event.beta, event.gamma);
      });

      // Opción 2: Usando DeviceOrientation API correctamente tipado
      this.deviceOrientationHandler = (evt: DeviceOrientationEvent) => {
        this.handleDeviceMotion(evt.beta, evt.gamma);
      };
      window.addEventListener('deviceorientation', this.deviceOrientationHandler);

      this.motionActive = true;
    } catch (error) {
      console.error('Error al iniciar motion:', error);
      this.setupMouseControls();
    }
  }

  private handleDeviceMotion(beta: number | null, gamma: number | null) {
    if (!this.viewer || !this.motionActive || beta === null || gamma === null) return;

    // Ajusta estos valores para cambiar la sensibilidad
    const sensitivity = 0.2;
    const panX = gamma * sensitivity;
    const panY = beta * sensitivity;

    // Mueve el target de la cámara
    this.viewer.cameraTarget = {
      x: panX,
      y: panY,
      z: 0
    };

    // Alternativamente, puedes rotar la cámara directamente
    this.viewer.cameraRotation = {
      x: -panY * (Math.PI / 180),
      y: panX * (Math.PI / 180),
      z: 0
    };
  }

  private setupMouseControls() {
    console.warn('Activando controles alternativos con ratón');
    
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    const container = this.elementRef.nativeElement;

    container.addEventListener('mousedown', (e: { clientX: number; clientY: number; }) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    });

    container.addEventListener('mousemove', (e: { clientX: number; clientY: number; }) => {
      if (!isDragging || !this.viewer) return;
      
      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      this.viewer.cameraRotation = {
        y: deltaX * 0.01,
        x: -deltaY * 0.01,
        z: 0
      };
    });

    container.addEventListener('mouseup', () => {
      isDragging = false;
    });

    container.addEventListener('mouseleave', () => {
      isDragging = false;
    });
  }

  ngOnDestroy() {
    Motion.removeAllListeners();
    if (this.deviceOrientationHandler) {
      window.removeEventListener('deviceorientation', this.deviceOrientationHandler);
    }
  }
}