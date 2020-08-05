import { Pipe, PipeTransform } from '@angular/core';
import { Goal } from '../api-common';


@Pipe({ name: 'goalTimeToStart' })
export class GoalTimeToStartPipe implements PipeTransform {
    transform(goal: Goal, currentTime: Date):string {
        
        const startDate = new Date(goal.startAt);
        var secondsToGo = (startDate.getTime() - currentTime.getTime()) / 1000;

        if (secondsToGo < 0) {
            secondsToGo = 0;
        }

        const daysToGo = Math.floor(secondsToGo / 86400);

        var retStr = "";

        if (daysToGo > 50) {
            retStr = startDate.getFullYear() + "-" + (startDate.getMonth() + 1).toString().padStart(2, "0")
            var options = { year: 'numeric', month: 'short', day: 'numeric'};
                        + "-" + startDate.getDate().toString().padStart(2, "0");
            retStr = new Intl.DateTimeFormat("en-GB", options).format(startDate);
        }
        else if (daysToGo > 3) {
            var options = { year: 'numeric', month: 'short', day: 'numeric'};
            var formattedDateWithYear = new Intl.DateTimeFormat("en-GB", options).format(startDate);
            if (formattedDateWithYear.length > 4) {
                retStr = formattedDateWithYear.substr(0, formattedDateWithYear.length-5);
            }
        }
        else if (secondsToGo > 0) {
            var options = { year: 'numeric', month: 'short', day: 'numeric'};
            var formattedDateWithYear = new Intl.DateTimeFormat("en-GB", options).format(startDate);

            if (formattedDateWithYear.length > 4) {
                retStr = formattedDateWithYear.substr(0, formattedDateWithYear.length-5);
                retStr += " " + startDate.getHours().toString().padStart(2, "0") + ":" + startDate.getMinutes().toString().padStart(2, "0");
            }
        }
        else {
            retStr = "Started";
        }

        return retStr;
    }
}

@Pipe({ name: 'goalTimeToEnd' })
export class GoalTimeToEndPipe implements PipeTransform {
    transform(goal: Goal, currentTime: Date):string {
        
        const endDate = new Date(goal.endAt);
        var secondsLeft = (endDate.getTime() - currentTime.getTime()) / 1000;

        if (secondsLeft < 0) {
            secondsLeft = 0;
        }

        const daysLeft = Math.floor(secondsLeft / 86400);
        const hoursLeft = Math.floor((secondsLeft % 86400) / 3600);
        const minutesLeft = Math.floor(((secondsLeft % 86400) % 3600) / 60);

        var retStr = "";

        if (daysLeft > 1) {
            retStr = daysLeft.toString() + "d";
        }
        else if (daysLeft > 0) {
            retStr = daysLeft.toString() + "d " + hoursLeft.toString() + "h";
        }
        else if (hoursLeft > 5) { // daysLeft is 0
            retStr = hoursLeft.toString() + "h";
        }
        else if (hoursLeft > 0) {
            retStr = hoursLeft.toString() + "h" + minutesLeft.toString() + "m";
        }
        else if (minutesLeft > 0) {
            retStr = minutesLeft.toString() + "m"
        }
        else if (secondsLeft > 0) {
            retStr = "< 1m";
        }
        else {
            retStr = "Expired";
        }

        return retStr;
    }
}

@Pipe({ name: 'goalTimeSinceExpiry'})
export class GoalTimeSinceExpiryPipe implements PipeTransform {
    transform(goal: Goal, currentTime: Date):string { 

        const endDate = new Date(goal.endAt);
        var secondsSinceEnd = (currentTime.getTime() - endDate.getTime()) / 1000;

        if (secondsSinceEnd < 0) {
            secondsSinceEnd = 0;
        }

        const daysSinceEnd = Math.floor(secondsSinceEnd / 86400);

        var retStr = "";

        if (daysSinceEnd > 50) {
            var options = { year: 'numeric', month: 'short', day: 'numeric'};
            retStr = new Intl.DateTimeFormat("en-GB", options).format(endDate);
        }
        else if (daysSinceEnd > 1) {
            var options = { year: 'numeric', month: 'short', day: 'numeric'};
            var formattedDateWithYear = new Intl.DateTimeFormat("en-GB", options).format(endDate);
            if (formattedDateWithYear.length > 4) {
                retStr = formattedDateWithYear.substr(0, formattedDateWithYear.length-5);
            }    
        }
        else if (secondsSinceEnd > 3600) {
            var hours = Math.round(secondsSinceEnd / 3600);
            retStr = hours.toString() + " hours ago";
        }
        else if (secondsSinceEnd > 0) {
            var minutes = Math.round(secondsSinceEnd / 60);
            retStr = minutes.toString() + " minutes ago";
        }
        else {
            retStr = "Active";
        }

        return retStr;
    }
}

@Pipe({ name: 'goalHeading' })
export class GoalHeadingPipe implements PipeTransform {
    transform(goal: Goal): string {
        
        var heading: string = "";

        if (goal.workoutCategoryName != "") {
            heading = goal.workoutCategoryName + " goal, " + goal.categoryName.toLowerCase() + ": ";
        }
        else {
            heading = goal.categoryName + " goal: ";
        }

        heading += goal.targetValue + " ";

        if (goal.categoryUnit != "#") {
            heading += goal.categoryUnit;
        }
        else {
            heading += "workouts";
        }

        return heading;
    }
}

@Pipe({ name: 'goalStatement' })
export class GoalStatementPipe implements PipeTransform {
    transform(goal: Goal, currentTime: Date): string {
        
        const cumulativeDistTypes = ["Running", "Cross-country skiing", "Roller skiing"];
        const endDate = new Date(goal.endAt);
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric'};
        var endDateString = new Intl.DateTimeFormat("en-GB", dateOptions).format(endDate);
 
        var statement: string = "I want to ";

        // Goal target
        if (goal.categoryName == "Workout count") {
            statement += "complete " + goal.targetValue + " " + goal.workoutCategoryName.toLowerCase() + " workouts ";
        }

        else if (goal.categoryName == "Weight loss") {
            statement += "lose " + (goal.startValue - goal.targetValue).toFixed(1) + " " + goal.categoryUnit + " to reach my target weight of " +  goal.targetValue + " " + goal.categoryUnit + " ";
        }

        else if ((goal.categoryName == "Cumulative climb") && (goal.workoutCategoryName == "Running")) {
            statement += "run for a total elevation gain of " + goal.targetValue + " " + goal.categoryUnit + " ";
        }

        else if ((goal.categoryName == "Cumulative distance") && cumulativeDistTypes.includes(goal.workoutCategoryName)) {
            if (goal.workoutCategoryName == "Running") {
                statement += "run a total of " + goal.targetValue + " " + goal.categoryUnit + " ";
            }
            else {
                statement += "go " + goal.workoutCategoryName + " for a total of " + goal.targetValue + " " + goal.categoryUnit + " ";
            }
        }

        else { // Should not be reached, but add a last resort
            statement += "complete my " + goal.categoryName + ":" + goal.targetValue + " " + goal.categoryUnit + " target ";
        }

        // Start and end dates
        statement += "by ";

        // Start date
        if (endDate.getFullYear() != currentTime.getFullYear()) {
            statement += endDateString;
        }
        else {
            if (endDateString.length > 4) {
                statement += endDateString.substr(0, endDateString.length-5);
            }
            else {
                statement = endDateString;
            }
        }

        return statement;
    }
}

@Pipe({ name: 'goalProgressPercentage' })
export class GoalProgressPercentagePipe implements PipeTransform {
    transform(goal: Goal, allowExtendedRange:boolean = true): number {
        var totalAmount: number = 0;
        var progressAmount: number = 0;

        // don't use abs(), because we can have negative progress (for example if we gain weight, and goal is 'weight loss')
        if (goal.targetValue > goal.startValue) {
            totalAmount = goal.targetValue - goal.startValue;
            progressAmount = goal.currentValue - goal.startValue;
        }
        else {
            totalAmount = goal.startValue - goal.targetValue;
            progressAmount = goal.startValue - goal.currentValue;            
        }

        var returnValue = 100;

        if (totalAmount > 0) {
            returnValue = 100 * progressAmount / totalAmount;
        }

        if ((!allowExtendedRange) && (returnValue > 100)) {
            returnValue = 100;
        }
        else if ((!allowExtendedRange) && (returnValue < 0)) {
            returnValue = 0;
        }

        return returnValue;
    }
}

@Pipe({ name: 'goalCategoryIcon' })
export class goalCategoryIconPipe implements PipeTransform {
    transform(goal: Goal): string {
        if (goal.categoryName == "Weight loss") {
            return "replay_5";
        }
        if (goal.workoutCategoryName == "Fitness") {
            return "fitness_center";
        }
        if ((goal.workoutCategoryName == "Cross-country skiing") || (goal.workoutCategoryName == "Roller skiing")) {
            return "ac_unit";
        }
        
        return "directions_run";
    }
}

@Pipe({ name: 'goalTargetFormatted' })
export class goalTargetFormattedPipe implements PipeTransform {
    transform(goal: Goal): string {
        var returnStr: string = "";
        
        if (goal.categoryName == "Weight loss") {
            returnStr += goal.currentValue.toFixed(1) + goal.categoryUnit + " vs " + goal.targetValue.toFixed(1) + goal.categoryUnit;
        }
        else if (goal.categoryName == "Workout count") {
            returnStr += (goal.currentValue - goal.startValue).toFixed(0) + " of " + (goal.targetValue - goal.startValue).toFixed(0);
        }
        else {
            returnStr += (goal.currentValue - goal.startValue).toFixed(1) + " of " + (goal.targetValue - goal.startValue).toFixed(1) + " " + goal.categoryUnit;
        }
        
        return returnStr;
    }
}

@Pipe({ name: 'goalDaysLeft' })
export class goalDaysLeftPipe implements PipeTransform {
    transform(goal: Goal, currentTime: Date): string {
        const startDate = new Date(goal.startAt);
        const endDate = new Date(goal.endAt);
        var returnStr: string = "";

        if (startDate > currentTime) { // not started
            const durationDays = (startDate.getTime() - currentTime.getTime()) / (86400 * 1000);

            if (durationDays < 1) {
                returnStr += "Starts in < 1 day";
            }
            else {
                returnStr += "Starts in " +  Math.round(durationDays) + " day(s)";
            }
        }
        else if (endDate < currentTime) { // finished
            returnStr = "Expired";
        }
        else { // ongoing
            const daysLeft = (endDate.getTime() - currentTime.getTime()) / (86400 * 1000);

            if (daysLeft < 1) {
                returnStr += "< 1 day left";
            }
            else {
                returnStr += Math.round(daysLeft) + " day(s) left";
            }            
        }
        
        return returnStr;
    }
}
