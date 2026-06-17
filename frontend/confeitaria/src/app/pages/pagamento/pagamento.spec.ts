import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pagamento } from './pagamento';

describe('Pagamento', () => {
  let component: Pagamento;
  let fixture: ComponentFixture<Pagamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pagamento],
    }).compileComponents();

    fixture = TestBed.createComponent(Pagamento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
