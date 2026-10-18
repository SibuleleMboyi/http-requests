import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import {Place} from "../place.model";
import {catchError, map, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {

  places = signal<Place[] | undefined>(undefined);
  public isFetching = signal(false);
  public error = signal('')

  private httpClient = inject(HttpClient)
  private destroyRef = inject(DestroyRef)

  ngOnInit(): void {
    this.isFetching.set(true);
    let http = this.httpClient
      .get<{places: Place[]}>('http://localhost:3000/user-places');
    const subscription$ = http
      .pipe(
        map((responseData) => responseData.places),
        catchError((error) => throwError(() => {
          let message: string = 'Something went wrong while fetching available places. Please try again later.'
          return new Error(message)
        }))
      )
      .subscribe({
        next: (places) => {
          this.places.set(places);
        },
        complete: () => {
          this.isFetching.update(() => false);
        },
        error: (error: Error) => {
          this.error.set(error?.message);
        }
      })
    this.destroyRef.onDestroy(() => subscription$.unsubscribe())
  }
}
