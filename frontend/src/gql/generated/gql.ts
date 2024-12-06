/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "mutation Login($loginInput: LoginRequestDTO!) {\n  login(loginInput: $loginInput) {\n    access_token\n    user {\n      createdAt\n      id\n      email\n      name\n      role\n    }\n  }\n}": types.LoginDocument,
    "mutation Register($registerInput: RegisterRequestDTO!) {\n  register(registerInput: $registerInput) {\n    access_token\n    user {\n      id\n      email\n      name\n      role\n      createdAt\n    }\n  }\n}": types.RegisterDocument,
    "mutation CreateEvent($createEventInput: CreateEventInput!, $image: Upload!) {\n  createEvent(createEventInput: $createEventInput, image: $image) {\n    date\n    creatorId\n    description\n    endTime\n    location\n    name\n    startTime\n  }\n}": types.CreateEventDocument,
    "mutation UpdateEvent($updateEventId: String!, $updateEventInput: UpdateEventInput!, $image: Upload) {\n  updateEvent(\n    id: $updateEventId\n    updateEventInput: $updateEventInput\n    image: $image\n  ) {\n    creatorId\n    date\n    description\n    image\n    location\n    name\n    startTime\n    endTime\n  }\n}": types.UpdateEventDocument,
    "mutation Mutation($createTicketTypeDto: CreateTicketTypeDTO!) {\n  CreateTicket(createTicketTypeDTO: $createTicketTypeDto) {\n    email\n    eventId\n    name\n    phoneNumber\n    price\n    quantity\n    ticketType\n    transactionId\n  }\n}": types.MutationDocument,
    "mutation UpdateTicketTypeQuantity($quantity: Int!, $ticketId: String!) {\n  UpdateTicketTypeQuantity(quantity: $quantity, ticketId: $ticketId) {\n    email\n    eventId\n    name\n    phoneNumber\n    price\n    quantity\n    ticketType\n    transactionId\n  }\n}": types.UpdateTicketTypeQuantityDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Login($loginInput: LoginRequestDTO!) {\n  login(loginInput: $loginInput) {\n    access_token\n    user {\n      createdAt\n      id\n      email\n      name\n      role\n    }\n  }\n}"): (typeof documents)["mutation Login($loginInput: LoginRequestDTO!) {\n  login(loginInput: $loginInput) {\n    access_token\n    user {\n      createdAt\n      id\n      email\n      name\n      role\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Register($registerInput: RegisterRequestDTO!) {\n  register(registerInput: $registerInput) {\n    access_token\n    user {\n      id\n      email\n      name\n      role\n      createdAt\n    }\n  }\n}"): (typeof documents)["mutation Register($registerInput: RegisterRequestDTO!) {\n  register(registerInput: $registerInput) {\n    access_token\n    user {\n      id\n      email\n      name\n      role\n      createdAt\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateEvent($createEventInput: CreateEventInput!, $image: Upload!) {\n  createEvent(createEventInput: $createEventInput, image: $image) {\n    date\n    creatorId\n    description\n    endTime\n    location\n    name\n    startTime\n  }\n}"): (typeof documents)["mutation CreateEvent($createEventInput: CreateEventInput!, $image: Upload!) {\n  createEvent(createEventInput: $createEventInput, image: $image) {\n    date\n    creatorId\n    description\n    endTime\n    location\n    name\n    startTime\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateEvent($updateEventId: String!, $updateEventInput: UpdateEventInput!, $image: Upload) {\n  updateEvent(\n    id: $updateEventId\n    updateEventInput: $updateEventInput\n    image: $image\n  ) {\n    creatorId\n    date\n    description\n    image\n    location\n    name\n    startTime\n    endTime\n  }\n}"): (typeof documents)["mutation UpdateEvent($updateEventId: String!, $updateEventInput: UpdateEventInput!, $image: Upload) {\n  updateEvent(\n    id: $updateEventId\n    updateEventInput: $updateEventInput\n    image: $image\n  ) {\n    creatorId\n    date\n    description\n    image\n    location\n    name\n    startTime\n    endTime\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Mutation($createTicketTypeDto: CreateTicketTypeDTO!) {\n  CreateTicket(createTicketTypeDTO: $createTicketTypeDto) {\n    email\n    eventId\n    name\n    phoneNumber\n    price\n    quantity\n    ticketType\n    transactionId\n  }\n}"): (typeof documents)["mutation Mutation($createTicketTypeDto: CreateTicketTypeDTO!) {\n  CreateTicket(createTicketTypeDTO: $createTicketTypeDto) {\n    email\n    eventId\n    name\n    phoneNumber\n    price\n    quantity\n    ticketType\n    transactionId\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateTicketTypeQuantity($quantity: Int!, $ticketId: String!) {\n  UpdateTicketTypeQuantity(quantity: $quantity, ticketId: $ticketId) {\n    email\n    eventId\n    name\n    phoneNumber\n    price\n    quantity\n    ticketType\n    transactionId\n  }\n}"): (typeof documents)["mutation UpdateTicketTypeQuantity($quantity: Int!, $ticketId: String!) {\n  UpdateTicketTypeQuantity(quantity: $quantity, ticketId: $ticketId) {\n    email\n    eventId\n    name\n    phoneNumber\n    price\n    quantity\n    ticketType\n    transactionId\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;