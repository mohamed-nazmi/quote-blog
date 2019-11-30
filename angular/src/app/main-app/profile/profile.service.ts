import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { ProfileInfo } from './profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
    private profileInfo: ProfileInfo;
    private profileUpdated = new Subject<ProfileInfo>();

    constructor(private http: HttpClient) { }

    getProfileInfo(username: string) {
        this.http.get<{ profileInfo: ProfileInfo }>('http://localhost:3000/profile/' + username)
            .subscribe(result => {
                this.profileInfo = result.profileInfo;
                this.profileUpdated.next(this.profileInfo);
            });
    }

    getProfileUpdateListener() {
        return this.profileUpdated.asObservable();
    }
}
