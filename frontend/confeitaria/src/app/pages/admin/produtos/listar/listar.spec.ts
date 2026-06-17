import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listar } from './listar';

describe('Listar', () => {
  let component: Listar;
  let fixture: ComponentFixture<Listar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Listar],
    }).compileComponents();

    fixture = TestBed.createComponent(Listar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
