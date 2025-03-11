/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NotificationResponseDto } from '../models/NotificationResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class NotificationControllerService {
    /**
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static markAsRead(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/notifications/{id}/read',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns NotificationResponseDto OK
     * @throws ApiError
     */
    public static getNotificationsByUserName(): CancelablePromise<Array<NotificationResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/notifications/',
        });
    }
}
