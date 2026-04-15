import { Component, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, 
  IonButtons, IonLabel, IonList, IonItem, IonButton, IonNote 
} from '@ionic/angular/standalone';
import { DatePipe, DecimalPipe, CommonModule } from '@angular/common';

// Interfaces & Services
import { Transactions } from '../interfaces/transactions.interface';
import { Database } from '../services/database';
import { ExportService } from '../services/export.services';

// Icons
import { addIcons } from 'ionicons';
import { 
  refreshOutline, arrowUpCircle, arrowDownCircle, 
  addOutline, trendingUpOutline, trendingDownOutline, 
  receiptOutline, downloadOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonHeader, IonToolbar, IonTitle, IonContent, IonIcon,
    IonButtons, IonLabel, IonList, IonItem, IonButton, IonNote,
    DatePipe, DecimalPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {
  // Service Injections
  private dbService = inject(Database);
  private router = inject(Router);
  private exportService = inject(ExportService);

  // Variable Declarations
  transactions: Transactions[] = [];
  totalBalance: number = 0;
  totalIncome: number = 0;
  totalExpenses: number = 0;

  constructor() {
    // Registering all icons used in the template
    addIcons({ 
      refreshOutline, 
      arrowUpCircle, 
      arrowDownCircle, 
      addOutline, 
      trendingUpOutline, 
      trendingDownOutline, 
      receiptOutline,
      downloadOutline 
    });
  }

  /**
   * Lifecycle: Runs every time the page becomes active.
   * Crucial for refreshing data after adding a new transaction.
   */
  async ionViewWillEnter() {
    await this.loadHistory();
  }

  /**
   * Lifecycle: Runs only once when the component is initialized.
   */
  async ngOnInit() {
    await this.loadHistory();
  }

  /**
   * Fetches data from the Database service (SQLite or LocalStorage fallback).
   */
  async loadHistory() {
    try {
      const data = await this.dbService.getTransactions();
      this.transactions = data || []; 
      this.calculateTotals();
      console.log('Data successfully loaded. Count:', this.transactions.length);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  }

  /**
   * Logic to calculate the balance summary based on transaction types.
   */
  calculateTotals() {
    this.totalIncome = 0;
    this.totalExpenses = 0;

    this.transactions.forEach(t => {
      const amt = Number(t.amount); // Ensures math safety
      if (t.type === 'Income') {
        this.totalIncome += amt;
      } else {
        this.totalExpenses += amt;
      }
    });

    this.totalBalance = this.totalIncome - this.totalExpenses;
  }

  /**
   * Navigation to the Add Transaction page.
   */
  openAddModal() {
    this.router.navigate(['/record-transaction']);
  }

  /**
   * Triggers the SheetJS export logic to generate an Excel file.
   */
  exportData() {
    if (this.transactions.length === 0) {
      alert("No data to export yet!");
      return;
    }
    
    try {
      this.exportService.exportToExcel(this.transactions);
      console.log('Exporting data to Excel...');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to generate Excel file.');
    }
  }
}