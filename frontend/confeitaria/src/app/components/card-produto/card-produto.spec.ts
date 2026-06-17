import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProduto } from './card-produto';

describe('CardProduto', () => {
  let component: CardProduto;
  let fixture: ComponentFixture<CardProduto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardProduto],
    }).compileComponents();

    fixture = TestBed.createComponent(CardProduto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
