import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AiRepsonse } from '../models/ait.interface';

@Injectable({
    providedIn: 'root',
})
export class AiService {
    private readonly http = inject(HttpClient);
    private readonly aiUrl_cbc = 'https://yousefm22-cbc-api.hf.space/api/upload/cbc';
    private readonly aiUrl_Diabeities = 'https://yousefm22-diabetes-api.hf.space/api/upload/diabetes';

    checkDiabeties(file: File): Observable<AiRepsonse> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<AiRepsonse>(this.aiUrl_Diabeities, formData);
    }
    checkCBC(file: File): Observable<AiRepsonse> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<AiRepsonse>(this.aiUrl_cbc, formData);
    }
}
