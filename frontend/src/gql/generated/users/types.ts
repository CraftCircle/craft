export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
  Upload: { input: any; output: any; }
};

export type CreateEventInput = {
  date: Scalars['DateTime']['input'];
  description: Scalars['String']['input'];
  endTime: Scalars['DateTime']['input'];
  image: InputMaybe<Scalars['Upload']['input']>;
  location: Scalars['String']['input'];
  name: Scalars['String']['input'];
  startTime: Scalars['DateTime']['input'];
};

export type CreateNotificationInput = {
  /** Example field (placeholder) */
  exampleField: Scalars['Int']['input'];
};

export type CreateOrderInput = {
  productId: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  userId: Scalars['String']['input'];
};

export type CreatePaymentAuth = {
  __typename?: 'CreatePaymentAuth';
  access_token: Maybe<Scalars['String']['output']>;
  expires_in: Scalars['String']['output'];
};

export type CreatePaymentInput = {
  accountReference: Scalars['String']['input'];
  amount: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
};

export type CreatePostInput = {
  audio: InputMaybe<Scalars['String']['input']>;
  content: Scalars['String']['input'];
  image: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  video: InputMaybe<Scalars['String']['input']>;
};

export type CreateProductInput = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  stock: Scalars['Int']['input'];
};

export type CreateTicketPurchaseDto = {
  eventId: Scalars['String']['input'];
  name: InputMaybe<Scalars['String']['input']>;
  quantity: Scalars['Int']['input'];
  ticketTypeId: Scalars['String']['input'];
  transactionId: Scalars['String']['input'];
};

export type CreateTicketTypeDto = {
  eventId: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  quantity: Scalars['Int']['input'];
  ticketType: TicketTypeEnum;
};

export type CreateUserInput = {
  /** Email of the user */
  email: Scalars['String']['input'];
  /** Name of the user */
  name: Scalars['String']['input'];
  /** Password of the user */
  password: InputMaybe<Scalars['String']['input']>;
  /** Authentication provider (e.g., google) */
  provider: InputMaybe<Scalars['String']['input']>;
  /** ID from the authentication provider */
  providerId: InputMaybe<Scalars['String']['input']>;
  /** Role of the user */
  role: Role;
};

export type EventEntity = {
  __typename?: 'EventEntity';
  creatorId: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  endTime: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  image: Scalars['String']['output'];
  location: Scalars['String']['output'];
  name: Scalars['String']['output'];
  startTime: Scalars['DateTime']['output'];
};

export type LoginRequestDto = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LoginResponseDto = {
  __typename?: 'LoginResponseDTO';
  access_token: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  CreateTicket: TicketEntity;
  DeleteTickets: Scalars['Boolean']['output'];
  PurchaseTicket: TicketEntity;
  UpdateTicketTypeQuantity: TicketEntity;
  changeUserRole: UserEntity;
  createEvent: EventEntity;
  createNotification: Notification;
  createOrder: Order;
  createPayment: CreatePaymentAuth;
  createPost: PostEntity;
  createProduct: Product;
  createUser: UserEntity;
  deleteEvent: Scalars['Boolean']['output'];
  deleteProduct: Product;
  login: LoginResponseDto;
  multipleUpload: Array<Scalars['String']['output']>;
  register: RegisterResponseDto;
  registerUrl: Scalars['String']['output'];
  removeNotification: Notification;
  removeOrder: Scalars['Boolean']['output'];
  removePost: PostEntity;
  removeUser: UserEntity;
  singleUpload: Scalars['String']['output'];
  updateEvent: EventEntity;
  updateNotification: Notification;
  updateOrder: Order;
  updatePost: PostEntity;
  updateProduct: Product;
  updateUser: UserEntity;
};


export type MutationCreateTicketArgs = {
  createTicketTypeDTO: CreateTicketTypeDto;
};


export type MutationDeleteTicketsArgs = {
  ticketId: Scalars['String']['input'];
};


export type MutationPurchaseTicketArgs = {
  createTicketPurchaseDTO: CreateTicketPurchaseDto;
};


export type MutationUpdateTicketTypeQuantityArgs = {
  quantity: Scalars['Int']['input'];
  ticketId: Scalars['String']['input'];
};


export type MutationChangeUserRoleArgs = {
  id: Scalars['String']['input'];
  newRole: Role;
};


export type MutationCreateEventArgs = {
  createEventInput: CreateEventInput;
  image: Scalars['Upload']['input'];
};


export type MutationCreateNotificationArgs = {
  createNotificationInput: CreateNotificationInput;
};


export type MutationCreateOrderArgs = {
  createOrderInput: CreateOrderInput;
};


export type MutationCreatePaymentArgs = {
  createPaymentInput: CreatePaymentInput;
};


export type MutationCreatePostArgs = {
  audio: InputMaybe<Scalars['Upload']['input']>;
  createPostInput: CreatePostInput;
  image: InputMaybe<Scalars['Upload']['input']>;
  video: InputMaybe<Scalars['Upload']['input']>;
};


export type MutationCreateProductArgs = {
  createProductInput: CreateProductInput;
};


export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};


export type MutationDeleteEventArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  loginInput: LoginRequestDto;
};


export type MutationMultipleUploadArgs = {
  files: Array<Scalars['Upload']['input']>;
};


export type MutationRegisterArgs = {
  registerInput: RegisterRequestDto;
};


export type MutationRemoveNotificationArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveOrderArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemovePostArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveUserArgs = {
  email: Scalars['String']['input'];
};


export type MutationSingleUploadArgs = {
  file: Scalars['Upload']['input'];
};


export type MutationUpdateEventArgs = {
  id: Scalars['String']['input'];
  image: InputMaybe<Scalars['Upload']['input']>;
  updateEventInput: UpdateEventInput;
};


export type MutationUpdateNotificationArgs = {
  updateNotificationInput: UpdateNotificationInput;
};


export type MutationUpdateOrderArgs = {
  id: Scalars['String']['input'];
  status: Scalars['String']['input'];
};


export type MutationUpdatePostArgs = {
  updatePostInput: UpdatePostInput;
};


export type MutationUpdateProductArgs = {
  updateProductInput: UpdateProductInput;
};


export type MutationUpdateUserArgs = {
  email: Scalars['String']['input'];
  updateUserInput: UpdateUserDto;
};

export type Notification = {
  __typename?: 'Notification';
  /** Example field (placeholder) */
  exampleField: Scalars['Int']['output'];
};

export type Order = {
  __typename?: 'Order';
  /** Example field (placeholder) */
  exampleField: Scalars['Int']['output'];
};

export type PostEntity = {
  __typename?: 'PostEntity';
  audio: Scalars['String']['output'];
  authorId: Scalars['String']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  image: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  video: Scalars['String']['output'];
};

export type Product = {
  __typename?: 'Product';
  /** Example field (placeholder) */
  exampleField: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  AllTickets: Array<TicketEntity>;
  EventEntity: EventEntity;
  Events: Array<EventEntity>;
  TicketsForAnEvent: Array<TicketEntity>;
  findAll: Array<UserEntity>;
  findOne: UserEntity;
  notification: Notification;
  notifications: Array<Notification>;
  order: Order;
  orders: Array<Order>;
  post: PostEntity;
  posts: Array<PostEntity>;
  product: Product;
  products: Array<Product>;
  whoAmI: UserEntity;
};


export type QueryEventEntityArgs = {
  id: Scalars['String']['input'];
};


export type QueryTicketsForAnEventArgs = {
  eventId: Scalars['String']['input'];
};


export type QueryFindOneArgs = {
  email: Scalars['String']['input'];
};


export type QueryNotificationArgs = {
  id: Scalars['Int']['input'];
};


export type QueryOrderArgs = {
  id: Scalars['String']['input'];
};


export type QueryPostArgs = {
  id: Scalars['String']['input'];
};


export type QueryProductArgs = {
  id: Scalars['String']['input'];
};

export type RegisterRequestDto = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  provider: InputMaybe<Scalars['String']['input']>;
  providerId: InputMaybe<Scalars['String']['input']>;
  role: InputMaybe<Role>;
};

export type RegisterResponseDto = {
  __typename?: 'RegisterResponseDTO';
  access_token: Scalars['String']['output'];
};

/** The roles a user can have */
export enum Role {
  Admin = 'ADMIN',
  Superadmin = 'SUPERADMIN',
  User = 'USER'
}

export type TicketEntity = {
  __typename?: 'TicketEntity';
  email: Scalars['String']['output'];
  eventId: Scalars['String']['output'];
  name: Scalars['String']['output'];
  phoneNumber: Maybe<Scalars['String']['output']>;
  price: Scalars['Float']['output'];
  quantity: Scalars['Int']['output'];
  ticketType: TicketTypeEnum;
  transactionId: Scalars['String']['output'];
};

/** The type of ticket */
export enum TicketTypeEnum {
  General = 'GENERAL',
  Student = 'STUDENT',
  Vip = 'VIP'
}

export type UpdateEventInput = {
  date: InputMaybe<Scalars['DateTime']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  endTime: InputMaybe<Scalars['DateTime']['input']>;
  image: InputMaybe<Scalars['Upload']['input']>;
  location: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  startTime: InputMaybe<Scalars['DateTime']['input']>;
};

export type UpdateNotificationInput = {
  /** Example field (placeholder) */
  exampleField: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['Int']['input'];
};

export type UpdatePostInput = {
  audio: InputMaybe<Scalars['String']['input']>;
  content: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  image: InputMaybe<Scalars['String']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
  video: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProductInput = {
  description: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name: InputMaybe<Scalars['String']['input']>;
  price: InputMaybe<Scalars['Float']['input']>;
  stock: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateUserDto = {
  email: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  /** Name of the user */
  name: InputMaybe<Scalars['String']['input']>;
  password: InputMaybe<Scalars['String']['input']>;
  /** Authentication provider (e.g., google) */
  provider: InputMaybe<Scalars['String']['input']>;
  /** ID from the authentication provider */
  providerId: InputMaybe<Scalars['String']['input']>;
  role: InputMaybe<Role>;
};

export type UserEntity = {
  __typename?: 'UserEntity';
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  password: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
  provider: Scalars['String']['output'];
  providerId: Scalars['String']['output'];
  role: Role;
  updatedAt: Scalars['DateTime']['output'];
};
