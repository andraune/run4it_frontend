import { Pipe, PipeTransform } from '@angular/core';
import { Workout } from '../api-common';


@Pipe({ name: 'workoutCategoryIcon' })
export class WorkoutCategoryIconPipe implements PipeTransform {
    transform(workout: Workout): string {
        
        var iconStr:string = "";
        switch (workout.categoryName) {
            case "Cross-country skiing":
                iconStr = "ac_unit";
            case "Fitness":
                iconStr = "fitness_center";
                break;
            case "Hiking":
                iconStr = "terrain";
                break;
            case "Running":
                iconStr = "directions_run";
                break;
            default:
                iconStr = "verified";
                break;
        }     
        return iconStr;
    }
}
