/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProjectResponseDto } from './ProjectResponseDto';
import type { TaskResponseDto } from './TaskResponseDto';
export type NotificationResponseDto = {
    id?: number;
    message?: string;
    project?: ProjectResponseDto;
    task?: TaskResponseDto;
    createdAt?: string;
    read?: boolean;
};

