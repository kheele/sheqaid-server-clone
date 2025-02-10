import {listAllPermissionOtherKeys} from "./query_other_keys";

const path = "permissions/other-keys";

eventManager.on(`${path}/list`, listAllPermissionOtherKeys);
