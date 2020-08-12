export interface WorkoutExtendedTrackDataPoint {
    latitude: number;
    longitude: number;
    elevation: number;
    duration: number;
    distance: number;
    speed: number;
    pace: string;
    heartBpm: number;
}

export interface WorkoutCategory {
    id: number;
    name: string;
    supportsGpsData: string;
}

export interface Workout {
    id: number;
    name: string;
    startAt: string;
    distance: number;
    duration: number;
    climb: number;
    edited: boolean;
    resourceFile: string;
    categoryName: string;
    averageSpeed: number;
    averagePace: string;
    trackData: WorkoutExtendedTrackDataPoint[];
    trackSplits: WorkoutExtendedTrackDataPoint[];
    trackSummary: WorkoutExtendedTrackDataPoint;
}
