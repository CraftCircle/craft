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
    "mutation DeleteEvent($deleteEventId: String!) {\n  deleteEvent(id: $deleteEventId)\n}": types.DeleteEventDocument,
    "mutation UpdateEvent($updateEventId: String!, $updateEventInput: UpdateEventInput!, $image: Upload) {\n  updateEvent(\n    id: $updateEventId\n    updateEventInput: $updateEventInput\n    image: $image\n  ) {\n    creatorId\n    date\n    description\n    image\n    location\n    name\n    startTime\n    endTime\n  }\n}": types.UpdateEventDocument,
    "mutation Mutation($createTicketTypeDto: CreateTicketTypeDTO!) {\n  CreateTicket(createTicketTypeDTO: $createTicketTypeDto) {\n    email\n    eventId\n    name\n    phoneNumber\n    price\n    quantity\n    ticketType\n    transactionId\n  }\n}": types.MutationDocument,
    "mutation UpdateTicketTypeQuantity($quantity: Int!, $ticketId: String!) {\n  UpdateTicketTypeQuantity(quantity: $quantity, ticketId: $ticketId) {\n    email\n    eventId\n    name\n    phoneNumber\n    price\n    quantity\n    ticketType\n    transactionId\n  }\n}": types.UpdateTicketTypeQuantityDocument,
    "query FindAll {\n  findAll {\n    createdAt\n    email\n    id\n    name\n    password\n    phoneNumber\n    provider\n    providerId\n    role\n    updatedAt\n  }\n}": types.FindAllDocument,
    "query WhoAmI {\n  whoAmI {\n    createdAt\n    email\n    id\n    name\n    password\n    phoneNumber\n    provider\n    providerId\n    role\n    updatedAt\n  }\n}": types.WhoAmIDocument,
    "query FindOne($email: String!) {\n  findOne(email: $email) {\n    createdAt\n    email\n    id\n    name\n    password\n    phoneNumber\n    provider\n    providerId\n    role\n    updatedAt\n  }\n}": types.FindOneDocument,
    "query Events {\n  Events {\n    creatorId\n    date\n    description\n    endTime\n    id\n    image\n    location\n    name\n    startTime\n  }\n}": types.EventsDocument,
    "query EventEntity($eventEntityId: String!) {\n  EventEntity(id: $eventEntityId) {\n    creatorId\n    date\n    description\n    endTime\n    id\n    image\n    location\n    name\n    startTime\n  }\n}": types.EventEntityDocument,
    "query AllTickets {\n  AllTickets {\n    email\n    eventId\n    name\n    phoneNumber\n    price\n    quantity\n    ticketType\n    transactionId\n  }\n}": types.AllTicketsDocument,
    "query TicketsForAnEvent($eventId: String!) {\n  TicketsForAnEvent(eventId: $eventId) {\n    email\n    eventId\n    name\n    phoneNumber\n    price\n    quantity\n    ticketType\n    transactionId\n  }\n}": types.TicketsForAnEventDocument,
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
export function graphql(source: "mutation DeleteEvent($deleteEventId: String!) {\n  deleteEvent(id: $deleteEventId)\n}"): (typeof documents)["mutation DeleteEvent($deleteEventId: String!) {\n  deleteEvent(id: $deleteEventId)\n}"];
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
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query FindAll {\n  findAll {\n    createdAt\n    email\n    id\n    name\n    password\n    phoneNumber\n    provider\n    providerId\n    role\n    updatedAt\n  }\n}"): (typeof documents)["query FindAll {\n  findAll {\n    createdAt\n    email\n    id\n    name\n    password\n    phoneNumber\n    provider\n    providerId\n    role\n    updatedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query WhoAmI {\n  whoAmI {\n    createdAt\n    email\n    id\n    name\n    password\n    phoneNumber\n    provider\n    providerId\n    role\n    updatedAt\n  }\n}"): (typeof documents)["query WhoAmI {\n  whoAmI {\n    createdAt\n    email\n    id\n    name\n    password\n    phoneNumber\n    provider\n    providerId\n    role\n    updatedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query FindOne($email: String!) {\n  findOne(email: $email) {\n    createdAt\n    email\n    id\n    name\n    password\n    phoneNumber\n    provider\n    providerId\n    role\n    updatedAt\n  }\n}"): (typeof documents)["query FindOne($email: String!) {\n  findOne(email: $email) {\n    createdAt\n    email\n    id\n    name\n    password\n    phoneNumber\n    provider\n    providerId\n    role\n    updatedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Events {\n  Events {\n    creatorId\n    date\n    description\n    endTime\n    id\n    image\n    location\n    name\n    startTime\n  }\n}"): (typeof documents)["query Events {\n  Events {\n    creatorId\n    date\n    description\n    endTime\n    id\n    image\n    location\n    name\n    startTime\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query EventEntity($eventEntityId: String!) {\n  EventEntity(id: $eventEntityId) {\n    creatorId\n    date\n    description\n    endTime\n    id\n    image\n    location\n    name\n    startTime\n  }\n}"): (typeof documents)["query EventEntity($eventEntityId: String!) {\n  EventEntity(id: $eventEntityId) {\n    creatorId\n    date\n    description\n    endTime\n    id\n    image\n    location\n    name\n    startTime\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query AllTickets {\n  AllTickets {\n    email\n    eventId\n    name\n    phoneNumber\n    price\n    quantity\n    ticketType\n    transactionId\n  }\n}"): (typeof documents)["query AllTickets {\n  AllTickets {\n    email\n    eventId\n    name\n    phoneNumber\n    price\n    quantity\n    ticketType\n    transactionId\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query TicketsForAnEvent($eventId: String!) {\n  TicketsForAnEvent(eventId: $eventId) {\n    email\n    eventId\n    name\n    phoneNumber\n    price\n    quantity\n    ticketType\n    transactionId\n  }\n}"): (typeof documents)["query TicketsForAnEvent($eventId: String!) {\n  TicketsForAnEvent(eventId: $eventId) {\n    email\n    eventId\n    name\n    phoneNumber\n    price\n    quantity\n    ticketType\n    transactionId\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;