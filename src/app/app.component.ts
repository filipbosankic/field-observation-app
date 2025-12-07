import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { syncService } from './data-access/sync/sync.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet]
})
export class AppComponent implements OnInit {

  ngOnInit(): void {
    console.log('AppComponent initialized');
    syncService.sync();
  }
}
