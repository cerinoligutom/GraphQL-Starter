/**
 * Refer to links below on how to test file uploads without a full blown front-end application by using REST clients such as Insomnia:
 * - https://github.com/prisma/graphql-playground/issues/597#issuecomment-439746204
 * - https://github.com/jaydenseric/graphql-multipart-request-spec
 *
 */

import { GraphQLUpload, FileUpload as GQL_FileUpload } from 'graphql-upload';

export const Upload = GraphQLUpload;

// Used as mapper for GraphQL Code Generator (see codegen.yml on how this is consumed)
// Read more @ https://graphql-code-generator.com/docs/plugins/typescript#scalars-scalarsmap
export type FileUpload = Promise<GQL_FileUpload>;
