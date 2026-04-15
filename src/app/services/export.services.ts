import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Transactions } from '../interfaces/transactions.interface';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  exportToExcel(data: Transactions[], fileName: string = 'Mama_Bertha_Transactions.xlsx') {
    // 1. Prepare the data (Clean up the objects for Excel)
    const worksheetData = data.map(t => ({
      Date: new Date(t.date).toLocaleDateString(),
      Description: t.description,
      Category: t.category,
      Type: t.type,
      Amount: t.amount
    }));

    // 2. Create a new Worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(worksheetData);

    // 3. Create a new Workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

    // 4. Save the file
    XLSX.writeFile(wb, fileName);
  }
}