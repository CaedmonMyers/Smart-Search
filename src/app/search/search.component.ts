// src/app/search/search.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PerplexityService } from '../perplexity.service';
import * as marked from 'marked';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchText: string = '';
  searchResponse: string = '';
  searching: boolean = false;
  apiKey: string = '';

  constructor(
    private perplexityService: PerplexityService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.apiKey = this.perplexityService.getApiKey();
    
    this.route.params.subscribe(params => {
      if (params['apiKey']) {
        this.perplexityService.saveApiKey(params['apiKey']);
        this.apiKey = params['apiKey'];
        this.router.navigate(['/']);
      }
      
      if (params['query']) {
        this.searchText = params['query'];
        this.submitSearch();
      }
    });
  }

  async submitSearch() {
    if (!this.searchText || this.searching) return;
    
    this.searching = true;
    try {
      const response = await this.perplexityService.search(this.searchText);
      const uniqueId = await this.perplexityService.saveSearch(this.searchText, response);
      
      const parsedResponse = await marked.parse(response);
      this.searchResponse = parsedResponse;
      this.router.navigate(['/result', uniqueId]);
    } catch (error) {
      console.error('Search error:', error);
      this.searchResponse = 'An error occurred during the search.';
    } finally {
      this.searching = false;
    }
  }
}