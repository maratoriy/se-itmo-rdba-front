/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserResponseDto } from './UserResponseDto';
export type CommentResponseDto = {
    id?: number;
    content?: string;
    createdAt?: string;
    updatedAt?: string;
    author?: UserResponseDto;
    allowEdit?: boolean;
};

