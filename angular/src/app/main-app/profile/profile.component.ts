import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { QuotesService } from '../quotes/quotes.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    viewQuotes: boolean;

    constructor(private quotesService: QuotesService) { }

    newQuoteForm = new FormGroup({
        newQuote: new FormControl('', Validators.required)
    });

    ngOnInit() {
        this.viewQuotes = true;
    }

    get newQuote() {
        return this.newQuoteForm.get('newQuote');
    }

    addQuote(newQuote: HTMLInputElement) {
        this.quotesService.addQuote(newQuote.value);
    }

    viewQuotesSection() {
        this.viewQuotes = true;
    }

    viewFriendsSection() {
        this.viewQuotes = false;
    }
}
