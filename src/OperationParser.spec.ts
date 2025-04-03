import { DefaultOperationParser } from './OperationParser';
import { OpenAPIV3 } from 'openapi-types';
import { OperationContext } from './openapi/OpenAPIVisitor';

describe('DefaultOperationParser', () => {
    const parser = new DefaultOperationParser();

    describe('operation identification', () => {
        it('should use operationId when available', () => {
            const operation: OpenAPIV3.OperationObject = {
                operationId: 'getUserProfile',
                summary: 'Get User Profile',
                responses: {}
            };
            const context: OperationContext = {
                method: OpenAPIV3.HttpMethods.GET,
                pattern: '/users/{id}/profile',
                path: {
                    summary: 'Get User Profile by ID'
                }
            };

            expect(parser.value(operation, context)).toBe('getUserProfile');
        });

        it('should use summary (camelCase) when operationId is missing', () => {
            const operation: OpenAPIV3.OperationObject = {
                summary: 'Get User Profile',
                responses: {}
            };
            const context: OperationContext = {
                method: OpenAPIV3.HttpMethods.GET,
                pattern: '/users/{id}/profile',
                path: {
                    summary: 'Get User Profile by ID'
                }
            };

            expect(parser.value(operation, context)).toBe('getUserProfile');
        });

        it('should use method and path when both operationId and summary are missing', () => {
            const operation: OpenAPIV3.OperationObject = {
                responses: {}
            };
            const context: OperationContext = {
                method: OpenAPIV3.HttpMethods.GET,
                pattern: '/users/profile',
                path: {}
            };

            expect(parser.value(operation, context)).toBe(`${OpenAPIV3.HttpMethods.GET.toUpperCase()} /users/profile`);
        });
    });
});