import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import {Place} from "../place.model";
import {PlacesService} from "../places.service";

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {

  public isFetching = signal(false);
  public error = signal('')

  private placesService = inject(PlacesService)
  private destroyRef = inject(DestroyRef)
  public places = this.placesService.loadedUserPlaces;


  ngOnInit(): void {
    this.isFetching.set(true);

      const subscription$ = this.placesService.loadUserPlaces()
        .subscribe({
        complete: () => {
          console.log("DonE!")
          this.isFetching.set(false);
        },
        error: (error: Error) => {
          this.error.set(error?.message);
          this.isFetching.set(false);
        }
      })
    this.destroyRef.onDestroy(() => subscription$.unsubscribe())
  }
}
