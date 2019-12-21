import { Component, OnInit } from '@angular/core';

import { SettingsService } from './settings.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
    imagePreview: string;
    file: File;

    constructor(private settingsService: SettingsService) { }

    ngOnInit() { }

    onImagePicked(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.file = file;
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
    }

    saveImage() {
        this.settingsService.updateImage(this.file);
    }
}
