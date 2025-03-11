/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaskRequestDto } from '../models/TaskRequestDto';
import type { TaskResponseDto } from '../models/TaskResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TaskControllerService {
    /**
     * @param id
     * @returns TaskResponseDto OK
     * @throws ApiError
     */
    public static getTaskById(
        id: number,
    ): CancelablePromise<TaskResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/tasks/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns TaskResponseDto OK
     * @throws ApiError
     */
    public static updateTask(
        id: number,
        requestBody: TaskRequestDto,
    ): CancelablePromise<TaskResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/tasks/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static deleteTask(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/tasks/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns TaskResponseDto OK
     * @throws ApiError
     */
    public static getAllTasks(): CancelablePromise<Array<TaskResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/tasks',
        });
    }
    /**
     * @param requestBody
     * @returns TaskResponseDto OK
     * @throws ApiError
     */
    public static createTask(
        requestBody: TaskRequestDto,
    ): CancelablePromise<TaskResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/tasks',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns string OK
     * @throws ApiError
     */
    public static getAvailableStatuses(): CancelablePromise<Array<'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/tasks/statuses',
        });
    }
    /**
     * @param projectId
     * @returns TaskResponseDto OK
     * @throws ApiError
     */
    public static getTasksByProjectId(
        projectId: number,
    ): CancelablePromise<Array<TaskResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/tasks/project/{projectId}',
            path: {
                'projectId': projectId,
            },
        });
    }
    /**
     * @returns string OK
     * @throws ApiError
     */
    public static getAvailablePriorities(): CancelablePromise<Array<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/tasks/priorities',
        });
    }
}
