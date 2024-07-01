import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSellerComponent } from './user-seller.component';

describe('UserSellerComponent', () => {
  let component: UserSellerComponent;
  let fixture: ComponentFixture<UserSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserSellerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
