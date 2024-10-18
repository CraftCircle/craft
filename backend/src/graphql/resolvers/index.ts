import { UserQuery, UserMutation } from "./user";
import { PostMutation, PostQuery } from "./post";
import { EventQuery, EventMutation } from "./event";
import { TicketQuery, TicketMutation } from "./ticket";
import { RoleMutation } from "./role";
import uploadResolvers from "./upload";

export const $Query = {
  UserQuery,
  PostQuery,
  EventQuery,
  TicketQuery,
};

export const $Mutation = {
  UserMutation,
  PostMutation,
  EventMutation,
  TicketMutation,
  RoleMutation,
};

export const $Upload = uploadResolvers;
