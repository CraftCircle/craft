import { UserQuery, UserMutation } from "./user";
import { PostMutation, PostQuery} from './post'

export const $Query = {
    UserQuery,
    PostQuery
};

export const $Mutation = {
    UserMutation,
    PostMutation
};
