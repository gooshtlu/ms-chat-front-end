import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlackPageComponent } from './flack-page.component';

describe('FlackPageComponent', () => {
  let component: FlackPageComponent;
  let fixture: ComponentFixture<FlackPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlackPageComponent]
    });
    fixture = TestBed.createComponent(FlackPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
