/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProjectRequestDto } from '../models/ProjectRequestDto';
import type { ProjectResponseDto } from '../models/ProjectResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProjectControllerService {
    /**
     * @param id
     * @returns ProjectResponseDto OK
     * @throws ApiError
     */
    public static getProjectById(
        id: number,
    ): CancelablePromise<ProjectResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/projects/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns ProjectResponseDto OK
     * @throws ApiError
     */
    public static updateProject(
        id: number,
        requestBody: ProjectRequestDto,
    ): CancelablePromise<ProjectResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/projects/{id}',
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
    public static deleteProject(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/projects/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns ProjectResponseDto OK
     * @throws ApiError
     */
    public static getAllProjects(): CancelablePromise<Array<ProjectResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/projects',
        });
    }
    /**
     * @param requestBody
     * @returns ProjectResponseDto OK
     * @throws ApiError
     */
    public static createProject(
        requestBody: ProjectRequestDto,
    ): CancelablePromise<ProjectResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/projects',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
