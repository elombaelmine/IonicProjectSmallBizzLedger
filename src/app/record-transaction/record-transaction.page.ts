import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonButton, IonContent, IonHeader, IonTitle, IonToolbar, 
  IonButtons, IonBackButton, IonItem, IonLabel, IonInput, 
  IonSelect, IonSelectOption, IonDatetime 
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Database } from '../services/database';
import { Transactions } from '../interfaces/transactions.interface';

@Component({
  selector: 'app-record-transaction',
  templateUrl: './record-transaction.page.html',
  styleUrls: ['./record-transaction.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, 
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, 
    IonButtons, IonBackButton, IonItem, IonLabel, IonInput, 
    IonSelect, IonSelectOption, IonDatetime
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RecordTransactionPage {
  private dbService = inject(Database);
  private router = inject(Router);

  // 1. Match the strict types from your interface
  description: string = '';
  amount: number | null = null;
  type: 'Income' | 'Expense' = 'Income';
  
  // Match the specific categories allowed in your interface
  category: 'Sales' | 'Marketing' | 'Salary' | 'Utility' | 'Logistic' | 'Purchase' = 'Sales';
  
  date: string = new Date().toISOString();

  constructor() { }

  async saveTransaction() {
    if (!this.description || !this.amount || this.amount <= 0) {
      alert('Please enter a description and a valid amount.');
      return;
    }

    // 2. Build newEntry to match the interface exactly
    const newEntry: Transactions = {
      description: this.description,
      amount: Number(this.amount),
      type: this.type,
      category: this.category,
      // Fixed: Interface wants a string, so we send the ISO string
      date: this.date 
    };

    try {
      await this.dbService.addTransaction(newEntry);
      alert('Transaction Saved!');
      this.router.navigate(['/home']); 
    } catch (error) {
      console.error('Database Error:', error);
      alert('Error saving transaction.');
    }
  }

  cancel() {
    this.router.navigate(['/home']);
  }
}