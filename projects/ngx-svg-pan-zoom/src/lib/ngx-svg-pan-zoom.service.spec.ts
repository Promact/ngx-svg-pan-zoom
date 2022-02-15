import { TestBed } from '@angular/core/testing';

import { NgxSvgPanZoomService } from './ngx-svg-pan-zoom.service';

describe('NgxSvgPanZoomService', () => {
  let service: NgxSvgPanZoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxSvgPanZoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
