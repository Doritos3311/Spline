import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplineViewerComponent } from './spline-viewer.component';

describe('SplineViewerComponent', () => {
  let component: SplineViewerComponent;
  let fixture: ComponentFixture<SplineViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SplineViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SplineViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
