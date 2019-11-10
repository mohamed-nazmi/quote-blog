import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Quote } from './quotes.model';
import { QuotesService } from './quotes.service';

@Component({
    selector: 'app-quotes',
    templateUrl: './quotes.component.html',
    styleUrls: ['./quotes.component.css']
})
export class QuotesComponent implements OnInit, OnDestroy {
    selectedHeart: number;

    quotes: Quote[];
    private quotesSub: Subscription;

    constructor(private quotesService: QuotesService) { }

    ngOnInit() {
        this.quotesService.getQuotes();
        this.quotesSub = this.quotesService.getQuoteUpdateListener()
            .subscribe(quotes => {
                this.quotes = quotes;
            });
    }

    ngOnDestroy() {
        this.quotesSub.unsubscribe();
    }

    deleteQuote(quoteId: string) {
        this.quotesService.deleteQuote(quoteId);
    }
}
