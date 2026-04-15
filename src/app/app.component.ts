import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Database } from './services/database';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
   standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private dbService = inject(Database);

  async ngOnInit() {
    await this.dbService.initializeDatabase();
    console.log('Database Ready!');
  }
  constructor() {}
}
