import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

export interface Puzzle {
    id: string;
    isActive: boolean;
}

@Injectable()
export class MockService {
    constructor() { }

    getPeople(): Observable<Puzzle[]> {
        let items = getMockPeople();
        return Observable.of(items).delay(500);
    }
}

function getMockPeople() {
    return [
        {
            'id': '5a15b13c36e7a7f00cf0d7cb',
            'isActive': true
        },
        {
            'id': '5a15b13c2340978ec3d2c0ea',
            'isActive': true
        },   
        {
            'id': '5a15b13c663ea0af9ad0dae8',
            'isActive': true
        },
        {
            'id': '5a15b13cc9eeb36511d65acf',
            'isActive': true
        },
        {
            'id': '5a15b13c728cd3f43cc0fe8a',
            'isActive': true
        },
        {
            'id': '5a15b13ca51b0aaf8a99c05a',
            'isActive': true
        },
        {
            'id': '5a15b13cc3b9381ffcb1d6f7',
            'isActive': true
        },
        {
            'id': '5a15b13ce58cb6ff62c65164',
            'isActive': true
        },
        {
            'id': '5a15b13c90b95eb68010c86e',
            'isActive': true
        },
        {
            'id': '5a15b13c2b1746e12788711f',
            'isActive': true
        },
        {
            'id': '5a15b13c605403381eec5019',
            'isActive': true
        },
        {
            'id': '5a15b13c67e2e6d1a3cd6ca5',
            'isActive': true
        },
        {
            'id': '5a15b13c947c836d177aa85c',
            'isActive': true
        },
        {
            'id': '5a15b13c5dbbe61245c1fb73',
            'isActive': true
        },
        {
            'id': '5a15b13c38fd49fefea8db80',
            'isActive': true
        },
        {
            'id': '5a15b13c9680913c470eb8fd',
            'isActive': true
        }
    ]
}