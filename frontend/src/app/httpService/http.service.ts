import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';

export interface Pokemon {
    id: number;
    poke_number: number;
    trainer_id: number;
    happiness: number;
    hunger: number;
    fatigue: number;
    xp: number;
    pokeName: string;
}

export interface Trainer {
    id: number;
    username: string;
    pokemon: Array<Pokemon>;
    currency: number;
}

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    private trainerApiUrl = "/api/trainer/";
    private pokeApiUrl = "/api/pokemon/";

    private _trainer: Trainer;

    constructor(private httpClient: HttpClient) {
    }

    loadTrainer(): Observable<Trainer> {
        if (this._trainer) {
            return of(this._trainer);
        }

        const observe: Observable<Trainer> = this.httpClient.get<Trainer>(this.trainerApiUrl);

        observe.subscribe(trainer => {
            this._trainer = trainer;
        });

        return observe;
    }

    registerRequest(username, email, password): Observable<Trainer> {
        const body = new HttpParams()
            .set('username', username)
            .set('email', email)
            .set('password', password);

        return this.httpClient.post<Trainer>(this.trainerApiUrl + 'register',
            body.toString(),
            {
                headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
            }
        );
    }

    login(username, password): Observable<Trainer> {
        const body = new HttpParams()
            .set('username', username)
            .set('password', password);

        const response = this.httpClient.post<Trainer>(this.trainerApiUrl + 'login',
            body.toString(),
            {
                headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
            }
        );

        response.subscribe(trainer => {
            this._trainer = trainer;
        });

        return response;
    }

    logout(): Observable<HttpResponse<number>> {
        this._trainer = null;
        return this.httpClient.delete<number>(this.trainerApiUrl + "logout", {observe: "response"});
    }

    newPokemonRequest(): Observable<Pokemon> {
        return this.httpClient.post<Pokemon>(this.pokeApiUrl + "new", "");
    }

    get trainer() {
        return this._trainer;
    }
}