import { Injectable } from '@angular/core';
import { governorates, cities, Governorate } from 'egydata';

@Injectable({
    providedIn: 'root',
})
export class EgyDataService {
    AllGovernatesData = governorates.getAll();
    GovernatesNames: Governorate[] = this.AllGovernatesData.map((element: any) => element.nameEn);
    default_GOV = { id: 0, code: '', name: '', nameEn: '' };

    getGovernorateByName(govName: string): Governorate {
        return this.AllGovernatesData.find((element: Governorate) => element.nameEn == govName) ?? this.default_GOV;
    }
    getCities(govName: string) {
        let selectedGovernate =this.getGovernorateByName(govName);
        let citiesData =cities.getByGovernorate(selectedGovernate.code); ;
        let citiesNames: string[] = citiesData.map((city: any) => city.nameEn);
        return citiesNames;
    }

}
