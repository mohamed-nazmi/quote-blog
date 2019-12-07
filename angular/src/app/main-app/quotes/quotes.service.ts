import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Quote } from './quotes.model';
import { environment } from '../../../environments/environment';

const BACKEND_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class QuotesService {
    private quotes: Quote[] = [];
    private quotesUpdated = new Subject<Quote[]>();

    constructor(private http: HttpClient) { }

    getQuotes() {
        this.http.get<{ quotes: Quote[] }>(BACKEND_URL + '/quotes')
            .subscribe(result => {
                this.quotes = result.quotes.reverse();
                this.quotesUpdated.next([...this.quotes]);
            });
    }

    getQuotesByUsername(username: string) {
        this.http.get<{ quotes: Quote[] }>(BACKEND_URL + '/quotes/' + username)
            .subscribe(result => {
                this.quotes = result.quotes;
                this.quotesUpdated.next([...this.quotes]);
            });
    }

    getQuoteUpdateListener() {
        return this.quotesUpdated.asObservable();
    }

    addQuote(content: string) {
        this.http.post<{ quote: Quote }>(
            BACKEND_URL + '/quote',
            {
                content
            })
            .subscribe(result => {
                this.quotes.unshift(result.quote);
                this.quotesUpdated.next([...this.quotes]);
            });
    }

    deleteQuote(quoteId: string) {
        this.http.delete(BACKEND_URL + '/quote/' + quoteId)
            .subscribe(() => {
                this.quotes = this.quotes.filter(quote => quote._id !== quoteId);
                this.quotesUpdated.next([...this.quotes]);
            });
    }
}
