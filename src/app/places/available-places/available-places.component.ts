import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import {PlacesService} from "../places.service";

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

  private destroyRef = inject(DestroyRef)
  private placesService = inject(PlacesService)


  ngOnInit(): void {
    this.isFetching.set(true);
    const subscription$ = this.placesService.loadAvailablePlaces()
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

  public onSelectedPlace(selectedPlace: Place) {
    const subscription$ = this.placesService.addPlaceToUserPlaces(selectedPlace.id).subscribe({
      next: (resData) => console.log(resData)
    })

    this.destroyRef.onDestroy(() => subscription$.unsubscribe())
  }
}
