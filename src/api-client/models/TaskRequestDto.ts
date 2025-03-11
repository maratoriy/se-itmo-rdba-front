/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TaskRequestDto = {
    title?: string;
    description?: string;
    status?: TaskRequestDto.status;
    priority?: TaskRequestDto.priority;
    projectId?: number;
    assignedUserId?: number;
};
export namespace TaskRequestDto {
    export enum status {
        PENDING = 'PENDING',
        IN_PROGRESS = 'IN_PROGRESS',
        COMPLETED = 'COMPLETED',
        CANCELLED = 'CANCELLED',
    }
    export enum priority {
        LOW = 'LOW',
        MEDIUM = 'MEDIUM',
        HIGH = 'HIGH',
        URGENT = 'URGENT',
    }
}

