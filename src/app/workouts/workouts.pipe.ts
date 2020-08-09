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

@Pipe({ name: 'workoutTimeOfDayString' })
export class WorkoutTimeOfDayStringPipe implements PipeTransform {
    transform(workout: Workout): string {
        
        const startDateTime = new Date(workout.startAt);
        const hours = startDateTime.getHours();
        var retStr: string = "";

        if ( hours < 4 ) {
            retStr = "Night";
        }
        else if (hours < 12) {
            retStr = "Morning";
        }
        else if (hours < 18) {
            retStr = "Afternoon";
        }
        else if (hours < 23) {
            retStr = "Evening";
        }
        else {
            retStr = "Night";
        }
   
        return retStr;
    }
}

@Pipe({ name: 'workoutDurationString' })
export class WorkoutDurationStringPipe implements PipeTransform {
    transform(workout: Workout): string {
        
        const hours = Math.floor(workout.duration / 3600);
        const minutes = Math.floor((workout.duration % 3600) / 60);
        const seconds = (workout.duration % 3600) % 60;
        
        var retStr: string = "";
        
        if (hours > 0) {
            retStr += hours.toString().padStart(2, "0") + "h ";
        }

        retStr += minutes.toString().padStart(2, "0") + "m " + seconds.toString().padStart(2, "0") + "s";
        return retStr;
    }
}

