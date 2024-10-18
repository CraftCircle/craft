import { GraphQLUpload } from "graphql-upload-minimal";
import { IResolvers} from "@graphql-tools/utils";

const uploadResolvers: IResolvers = {
    Upload: GraphQLUpload,
};

export default uploadResolvers;