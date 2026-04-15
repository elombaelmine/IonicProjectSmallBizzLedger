import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Transactions } from '../interfaces/transactions.interface';

@Injectable({
  providedIn: 'root'
})
export class Database {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private isNative: boolean = false;

  constructor() { }

  async initializeDatabase() {
    try {
      // Check if we are on a native platform
      this.db = await this.sqlite.createConnection('smallbiz_db', false, 'no-encryption', 1, false);
      await this.db.open();
      this.isNative = true;

      const schema = `
        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          type TEXT NOT NULL,
          amount REAL NOT NULL,
          date TEXT NOT NULL, 
          description TEXT,
          category TEXT NOT NULL
        );
      `;
      await this.db.execute(schema);
    } catch (err) {
      console.warn("Native SQLite not available, running in web mode.");
      this.isNative = false;
    }
  }

  // 3. Updated Add Transaction with Fallback
  async addTransaction(t: Transactions) {
    if (this.isNative && this.db) {
      const sql = `INSERT INTO transactions (type, amount, date, description, category) VALUES (?, ?, ?, ?, ?)`;
      return await this.db.run(sql, [t.type, t.amount, t.date, t.description, t.category]);
    } else {
      // Web Browser Fallback using LocalStorage
      return this.saveToLocalStorage(t);
    }
  }

  // 4. Updated Get Transactions with Fallback
  async getTransactions() {
    if (this.isNative && this.db) {
      const sql = `SELECT * FROM transactions ORDER BY date DESC`;
      const result = await this.db.query(sql);
      return result.values as Transactions[];
    } else {
      // Retrieve from LocalStorage for Browser Testing
      const data = localStorage.getItem('transactions');
      return data ? JSON.parse(data) : [];
    }
  }

  // Helper for Browser testing
  private saveToLocalStorage(t: Transactions) {
    const existingData = localStorage.getItem('transactions');
    const list = existingData ? JSON.parse(existingData) : [];
    
    // Add a fake ID for browser list tracking
    const newEntry = { ...t, id: Date.now() };
    list.unshift(newEntry); // Put new items at the top
    
    localStorage.setItem('transactions', JSON.stringify(list));
    return true;
  }
}