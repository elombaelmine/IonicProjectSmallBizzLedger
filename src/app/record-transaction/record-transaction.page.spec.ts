import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordTransactionPage } from './record-transaction.page';

describe('RecordTransactionPage', () => {
  let component: RecordTransactionPage;
  let fixture: ComponentFixture<RecordTransactionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordTransactionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
