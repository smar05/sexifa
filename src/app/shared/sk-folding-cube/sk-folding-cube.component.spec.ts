import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkFoldingCubeComponent } from './sk-folding-cube.component';

describe('SkFoldingCubeComponent', () => {
  let component: SkFoldingCubeComponent;
  let fixture: ComponentFixture<SkFoldingCubeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkFoldingCubeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkFoldingCubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
