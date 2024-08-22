import { UserQuery, UserMutation } from "./user";
import { PostMutation, PostQuery} from './post'
import { EventQuery, EventMutation } from './event'

export const $Query = {
    UserQuery,
    PostQuery,
    EventQuery

};

export const $Mutation = {
    UserMutation,
    PostMutation,
    EventMutation
};
