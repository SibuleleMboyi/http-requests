import {inject, Injectable, signal} from '@angular/core';

import { Place } from './place.model';
import {catchError, map, tap, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private httpClient = inject(HttpClient)

  public loadedUserPlaces = this.userPlaces.asReadonly();

  public loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:3000/places',
      'Something went wrong while fetching available places. Please try again later.'
    );
  }

  loadUserPlaces() {
    return this.fetchPlaces('http://localhost:3000/user-places',
      'Something went wrong while fetching user favourite places. Please try again later.'
    ).pipe(
      tap({
      next: (userPlaces) => this.userPlaces.set(userPlaces)
    }));
  }

  addPlaceToUserPlaces(place: Place) {
    const prevPlaces = this.userPlaces();
    this.userPlaces.update(prevPlaces => [...prevPlaces, place]);

    return this.httpClient.put('http://localhost:3000/user-places', {
      placeId: place.id,
    }).pipe(
      catchError(error => {
        this.userPlaces.set(prevPlaces)
        return throwError(() => new Error('Failed to store selected place.'))
      })
    )
  }

  removeUserPlace(place: string) {}

  private fetchPlaces(url: string, errorMessage: string) {
    return this.httpClient
      .get<{places: Place[]}>(url)
      .pipe(
        map((responseData) => responseData.places),
        catchError((error) => throwError(() => {
          return new Error(errorMessage)
        }))
      )
  }
}
