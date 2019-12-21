import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

const BACKEND_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    constructor(private http: HttpClient) { }

    updateImage(image: File) {
        const imageData = new FormData();
        // third option is image title -> will be updated later!
        imageData.append('image', image, 'title');
        this.http.post(BACKEND_URL + '/update-image', imageData)
            .subscribe(result => {
                // ..
            });
    }
}
