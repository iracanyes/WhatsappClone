import {ChatRoomUser} from "../types";

declare module '*.graphql' {
  import { DocumentNode } from "graphql";
  const Schema: DocumentNode;
  export { Schema };
  export default defaultDocument;
}


