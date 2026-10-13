import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],

})
export class AvailablePlacesComponent implements OnInit{
  places = signal<Place[] | undefined>(undefined);
  public isFetching = signal(false);
  public error = signal('')

    private httpClient = inject(HttpClient)
  private destroyRef = inject(DestroyRef)

  ngOnInit(): void {
    this.isFetching.set(true);
    let http = this.httpClient
      .get<{places: Place[]}>('http://localhost:3000/places');
    const subscription$ = http
      .pipe(
        map((responseData) => responseData.places)
      )
      .subscribe({
      next: (places) => {
        this.places.set(places);
      },
        complete: () => {
        this.isFetching.update(() => false);
        },
        error: (err) => {
        let message: string = 'Something went wrong while fetching available places. Please try again later.'
        this.error.set(message);
        }
    })
    this.destroyRef.onDestroy(() => subscription$.unsubscribe())
  }
}
