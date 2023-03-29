import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Translation, TranslocoLoader } from '@ngneat/transloco';
import { Observable } from 'rxjs';

// https://medium.com/angular-in-depth/lazy-load-and-encapsulate-i18n-files-in-angular-with-transloco-55af44885797
@Injectable({
    providedIn: 'root'
})
export class ApplicationTranslocoHttpLoader implements TranslocoLoader {
    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Get translation
     *
     * @param lang
     */
    getTranslation(lang: string): Observable<Translation> {
        return this._httpClient.get<Translation>(`./assets/i18n/${lang}.json?v=${new Date().getTime()}`); // this is used to force reload the json file
    }
}
