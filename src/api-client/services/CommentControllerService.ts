/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommentRequestDto } from '../models/CommentRequestDto';
import type { CommentResponseDto } from '../models/CommentResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CommentControllerService {
    /**
     * @param id
     * @returns CommentResponseDto OK
     * @throws ApiError
     */
    public static getCommentById(
        id: number,
    ): CancelablePromise<CommentResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/comments/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns CommentResponseDto OK
     * @throws ApiError
     */
    public static updateComment(
        id: number,
        requestBody: CommentRequestDto,
    ): CancelablePromise<CommentResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/comments/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns CommentResponseDto OK
     * @throws ApiError
     */
    public static createComment(
        requestBody: CommentRequestDto,
    ): CancelablePromise<CommentResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/comments',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param taskId
     * @returns CommentResponseDto OK
     * @throws ApiError
     */
    public static getCommentsByTaskId(
        taskId: number,
    ): CancelablePromise<Array<CommentResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/comments/task/{taskId}',
            path: {
                'taskId': taskId,
            },
        });
    }
}
