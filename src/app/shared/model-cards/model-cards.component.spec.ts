import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelCardsComponent } from './model-cards.component';

describe('ModelCardsComponent', () => {
  let component: ModelCardsComponent;
  let fixture: ComponentFixture<ModelCardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModelCardsComponent]
    });
    fixture = TestBed.createComponent(ModelCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
