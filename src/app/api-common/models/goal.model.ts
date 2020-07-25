export interface Goal {
    id: number;
    startAt: string;
    endAt: string;
    duration: number;
    startValue: number;
    targetValue: number;
    currentValue: number;
    categoryName: string;
    categoryUnit: string;
}

export interface GoalCategory {
    id: number;
    name: string;
    unit: string;
    workoutCategoryName: string;
}
