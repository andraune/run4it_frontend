import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'progressValue'})
export class ProgressValuePipe implements PipeTransform {
    transform(startValue: number, endValue: number, returnMin: boolean): number {
        if (returnMin) {
            return Math.min(startValue, endValue);
        } 
        return Math.max(startValue, endValue);
    }
}

@Pipe({ name: 'timeToStart' })
export class TimeToStartPipe implements PipeTransform {
    transform(currentTime: Date, goalStartAt: string):string {
        
        const startDate = new Date(goalStartAt);
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

@Pipe({ name: 'timeToEnd' })
export class TimeToEndPipe implements PipeTransform {
    transform(currentTime: Date, goalEndAt: string):string {
        
        const endDate = new Date(goalEndAt);
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

@Pipe({ name: 'timeSinceExpiry'})
export class TimeSinceExpiryPipe implements PipeTransform {
    transform(goalEndAt: string, currentTime: Date):string { 

        const endDate = new Date(goalEndAt);
        var secondsSinceEnd = (currentTime.getTime() - endDate.getTime()) / 1000;

        if (secondsSinceEnd < 0) {
            secondsSinceEnd = 0;
        }

        const daysSinceEnd = Math.floor(secondsSinceEnd / 86400);

        var retStr = "";

        if (daysSinceEnd > 50) {
            var options = { year: 'numeric', month: 'short', day: 'numeric'};
            retStr = new Intl.DateTimeFormat("en-GB", options).format(daysSinceEnd);
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

@Pipe({ name: 'formatLabel' })
export class FormatLabelPipe implements PipeTransform {
    transform(startValue: number, endValue: number, labelUnit: string, isMinLabel: boolean):string {
        
        var labelValue = Math.min(startValue, endValue);
        if (!isMinLabel) {
            labelValue = Math.max(startValue, endValue);
        }
        
        var retStr = "";

        switch(labelUnit) {
            case 'kg':
                retStr = labelValue.toFixed(1).toString();
                break;
            default:
                retStr = labelValue.toString();
                break;
        }

        return retStr;
    }
}
