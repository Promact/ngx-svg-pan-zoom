import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxSvgPanZoomComponent } from './ngx-svg-pan-zoom.component';

describe('NgxSvgPanZoomComponent', () => {
  let component: NgxSvgPanZoomComponent;
  let fixture: ComponentFixture<NgxSvgPanZoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxSvgPanZoomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxSvgPanZoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
