import { Component, OnInit, OnChanges, OnDestroy, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Workout, Profile, ProfileService, WorkoutExtendedTrackDataPoint } from '../../api-common';

@Component({
  selector: 'app-workout-map',
  templateUrl: './workout-map.component.html',
  styleUrls: ['../workouts.component.css', './workout-map.component.css']
})


export class WorkoutMapComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() workout: Workout = {} as Workout;
    
    @ViewChild('mapContainer', { static: false }) mapElement: ElementRef;
    private map: google.maps.Map;
    public canShowMap: boolean = true;

    private profileSubscription: Subscription = null;
    public profile: Profile;


    constructor(private profileService: ProfileService) {}

    ngOnInit() {
        this.profileSubscription = this.profileService.profile.subscribe((profileData: Profile) => { this.profile = profileData; });
    }

    ngAfterViewInit() {
        this._createMap();
    }

    ngOnDestroy() {
        if (this.profileSubscription) {
            this.profileSubscription.unsubscribe();
        }
    }

    private _createMap() {   
        if (this.workout.trackData && this.workout.trackData.length > 1) {
            const mapOptions: google.maps.MapOptions = { 
                center: this._getCenterCoordinates(this.workout.trackData),
                zoom: 10,
                clickableIcons: false,
                fullscreenControl: true,
                mapTypeControl: false,
                streetViewControl: false,
                scaleControl: true,
            };

            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
            this._addRoute(this.map, this.workout.trackData);
            this.canShowMap = true;
        }
        else {
            this.canShowMap = false;
        }
    }

    private _addRoute(map:google.maps.Map, trackData:WorkoutExtendedTrackDataPoint[]) {
        var polyLine = new google.maps.Polyline({
            strokeColor: 'rgb(244, 67, 54)',
            strokeOpacity: 1.0,
            strokeWeight: 3
        });

        // Add the actual route
        var polyLinePath = polyLine.getPath();
        var mapBounds = new google.maps.LatLngBounds();

        trackData.forEach(point => {
            var latLongPoint = new google.maps.LatLng(point.latitude, point.longitude);
            polyLinePath.push(latLongPoint);
            mapBounds.extend(latLongPoint);
        });

        polyLine.setMap(map); 
        map.fitBounds(mapBounds);

        
        // Add markers for start and end
        var startMarker = new google.maps.Marker({
            position: new google.maps.LatLng(trackData[0].latitude, trackData[0].longitude),
            icon: { url: `https://maps.google.com/mapfiles/kml/paddle/go.png` },
            map: map
        });

        var endMarker = new google.maps.Marker({
            position: new google.maps.LatLng(trackData[trackData.length-1].latitude, trackData[trackData.length-1].longitude),
            icon: { url: `https://maps.google.com/mapfiles/kml/paddle/red-square.png` },
            map: map
        });
    }

    private _getCenterCoordinates(trackData: WorkoutExtendedTrackDataPoint[]) {
        // Just use start point, as we fit to bounds later anyway
        return new google.maps.LatLng(
            trackData[0].latitude,
            trackData[0].longitude
        );
    }
}
