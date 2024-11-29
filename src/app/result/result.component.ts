// src/app/result/result.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PerplexityService } from '../perplexity.service';
import * as marked from 'marked';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  query: string = '';
  response: string = '';
  loading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private perplexityService: PerplexityService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(async params => {
      if (params['id']) {
        try {
          const result = await this.perplexityService.getSearch(params['id']);
          if (result) {
            this.query = result['query'];
            const parsedResponse = await marked.parse(result['response']);
            this.response = parsedResponse;
          } else {
            this.error = 'Search result not found';
          }
        } catch (error) {
          console.error('Error fetching result:', error);
          this.error = 'Error loading search result';
        } finally {
          this.loading = false;
        }
      }
    });
  }
}