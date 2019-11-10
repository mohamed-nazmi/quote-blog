import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Quote } from './quotes.model';

@Injectable({ providedIn: 'root' })
export class QuotesService {
    private quotes: Quote[] = [];
    private quotesUpdated = new Subject<Quote[]>();

    constructor(private http: HttpClient) { }

    getQuotes() {
        this.http.get<{ quotes: Quote[] }>('http://localhost:3000/quotes')
            .subscribe(result => {
                this.quotes = result.quotes.reverse();
                this.quotesUpdated.next([...this.quotes]);
            });
    }

    getQuoteUpdateListener() {
        return this.quotesUpdated.asObservable();
    }

    addQuote(content: string) {
        this.http.post<{ quote: Quote }>(
            'http://localhost:3000/quote',
            {
                content
            })
            .subscribe(result => {
                this.quotes.unshift(result.quote);
                this.quotesUpdated.next([...this.quotes]);
            });
    }

    deleteQuote(quoteId: string) {
        this.http.delete('http://localhost:3000/quote/' + quoteId)
            .subscribe(() => {
                this.quotes = this.quotes.filter(quote => quote._id !== quoteId);
                this.quotesUpdated.next([...this.quotes]);
            });
    }
}
