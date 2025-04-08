import { N8NINodeProperties } from './SchemaToINodeProperties';
import { OpenAPIV3 } from 'openapi-types';

describe('SchemaToINodeProperties', () => {
  describe('fromRequestBody', () => {
    it('should handle application/json content type', () => {
      const doc = {
        components: {
          schemas: {
            TestSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string'
                }
              }
            }
          }
        }
      };
      
      const requestBody: OpenAPIV3.RequestBodyObject = {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string'
                }
              }
            }
          }
        }
      };
      
      const n8nProperties = new N8NINodeProperties(doc);
      const result = n8nProperties.fromRequestBody(requestBody);
      
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('name');
      expect(result[0].routing!.send!.type).toBe('body');
    });
    
    it('should handle application/x-www-form-urlencoded content type', () => {
      const doc = {
        components: {
          schemas: {}
        }
      };
      
      const requestBody: OpenAPIV3.RequestBodyObject = {
        content: {
          'application/x-www-form-urlencoded': {
            schema: {
              type: 'object',
              properties: {
                username: {
                  type: 'string'
                },
                password: {
                  type: 'string'
                }
              }
            }
          }
        }
      };
      
      const n8nProperties = new N8NINodeProperties(doc);
      const result = n8nProperties.fromRequestBody(requestBody);
      
      expect(result.length).toBe(2);
      expect(result[0].name).toBe('username');
      expect(result[0].routing!.send!.type).toBe('body');
      expect(result[1].name).toBe('password');
      expect(result[1].routing!.send!.type).toBe('body');
    });
    
    it('should handle multipart/form-data content type with binary file', () => {
      const doc = {
        components: {
          schemas: {}
        }
      };
      
      const requestBody: OpenAPIV3.RequestBodyObject = {
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                file: {
                  type: 'string',
                  format: 'binary'
                },
                description: {
                  type: 'string'
                }
              }
            }
          }
        }
      };
      
      const n8nProperties = new N8NINodeProperties(doc);
      const result = n8nProperties.fromRequestBody(requestBody);
      
      expect(result.length).toBe(2);
      expect(result[0].name).toBe('file');
      expect(result[0].type).toBe('string');
      expect(result[0].routing!.send!.type).toBe('body');
      expect(result[0].routing!.send!.value).toContain('$binary');
      expect(result[1].name).toBe('description');
      expect(result[1].routing!.send!.type).toBe('body');
    });
    
    it('should prioritize content types in order: json, form-urlencoded, multipart', () => {
      const doc = {
        components: {
          schemas: {}
        }
      };
      
      const requestBody: OpenAPIV3.RequestBodyObject = {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                jsonProp: {
                  type: 'string'
                }
              }
            }
          },
          'application/x-www-form-urlencoded': {
            schema: {
              type: 'object',
              properties: {
                formProp: {
                  type: 'string'
                }
              }
            }
          },
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                multipartProp: {
                  type: 'string'
                }
              }
            }
          }
        }
      };
      
      const n8nProperties = new N8NINodeProperties(doc);
      const result = n8nProperties.fromRequestBody(requestBody);
      
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('jsonProp');
    });
  });
}); 