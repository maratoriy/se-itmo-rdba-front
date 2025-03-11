/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserResponseDto } from './UserResponseDto';
export type TaskResponseDto = {
    id?: number;
    title?: string;
    description?: string;
    status?: TaskResponseDto.status;
    assignedUser?: UserResponseDto;
    projectId?: number;
    priority?: TaskResponseDto.priority;
    createdAt?: string;
    updatedAt?: string;
};
export namespace TaskResponseDto {
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

