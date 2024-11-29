import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PerplexityService } from '../perplexity.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  apiKey: string = '';
  saved: boolean = false;

  constructor(
    private perplexityService: PerplexityService,
    private router: Router
  ) {}

  ngOnInit() {
    this.apiKey = this.perplexityService.getApiKey();
  }

  saveApiKey() {
    this.perplexityService.saveApiKey(this.apiKey);
    this.saved = true;
    setTimeout(() => {
      this.saved = false;
    }, 2000);
  }

  goToSearch() {
    this.router.navigate(['/']);
  }
}