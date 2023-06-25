import { PluginManager } from "@ulibs/plugin";
import BasePlugin from "./plugins/base/index.js";
import CrudPlugin from "./plugins/crud/index.js";
import UserManagementPlugin from "./plugins/user-management/index.js";
import AdminPanelPlugin from "./plugins/admin/index.js";

const pm = PluginManager({
  config: "./plugins.json",
});

await pm.install("base", BasePlugin());

await pm.install("admin-panel", AdminPanelPlugin());
await pm.install("user-management", UserManagementPlugin());
await pm.install("crud", CrudPlugin());

await pm.start();
