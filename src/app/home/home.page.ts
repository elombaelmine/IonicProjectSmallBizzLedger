import { Component, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, 
  IonButtons, IonLabel, IonList, IonItem, IonButton, IonNote,
} from '@ionic/angular/standalone';
import { DatePipe, DecimalPipe, CommonModule,} from '@angular/common';
import { Transactions } from '../interfaces/transactions.interface';
import { Database } from '../services/database';
import { addIcons } from 'ionicons';
import { 
  refreshOutline, arrowUpCircle, arrowDownCircle, 
  addOutline, trendingUpOutline, trendingDownOutline, receiptOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true, // Ensure standalone is true
  imports: [
    CommonModule, // Added for @for and @if support
    IonHeader, IonToolbar, IonTitle, IonContent, IonIcon,
    IonButtons, IonLabel, IonList, IonItem, IonButton, IonNote,
    DatePipe, DecimalPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
// ... existing imports ...

export class HomePage implements OnInit { // You can keep OnInit for the first load
  private dbService = inject(Database);
  private router = inject(Router);

  transactions: Transactions[] = [];
  totalBalance: number = 0;
  totalIncome: number = 0;
  totalExpenses: number = 0;

  constructor() {
    addIcons({ 
      refreshOutline, arrowUpCircle, arrowDownCircle, 
      addOutline, trendingUpOutline, trendingDownOutline, receiptOutline 
    });
  }

  // 1. THIS IS THE FIX: This runs every time you return to this screen
  async ionViewWillEnter() {
    await this.loadHistory();
  }

  async ngOnInit() {
    // Keep this for the very first time the app opens
    await this.loadHistory();
  }

  async loadHistory() {
    try {
      const data = await this.dbService.getTransactions();
      // Ensure data is an array before assigning
      this.transactions = data || []; 
      this.calculateTotals();
      console.log('Home loaded:', this.transactions.length, 'items');
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  }

  calculateTotals() {
    this.totalIncome = 0;
    this.totalExpenses = 0;

    this.transactions.forEach(t => {
      // Use Number() to prevent string concatenation (e.g., 100 + 100 = 100100)
      const amt = Number(t.amount); 
      if (t.type === 'Income') {
        this.totalIncome += amt;
      } else {
        this.totalExpenses += amt;
      }
    });

    this.totalBalance = this.totalIncome - this.totalExpenses;
  }

  openAddModal() {
    this.router.navigate(['/record-transaction']);
  }
}