// import { HomePage } from "./views.js";
// import { LoginPage } from "./views.js";

import { AdminLayout, AdminPage, LoginPage } from "./views.js";
import { View } from "@ulibs/components";

export default function AdminPanelPlugin({
  loginRoute = "/login",
  adminPrefix = "/admin",
  adminPage = AdminPage,
  adminLayoutComponent = AdminLayout,
  loginPageComponent = LoginPage,
  logoComponent = () => View({ tag: "h3" }, "Logo"),
  defaultTitle = "Admin Panel",
} = {}) {
  return {
    updateCtx(ctx) {
      let sidebarItems = [];
      ctx.addSidebarItem = (item) => {
        sidebarItems = [...sidebarItems, item];
      };
      ctx.getSidebarItems = () => {
        return sidebarItems;
      };

      ctx.adminPrefix = adminPrefix;

      ctx.respond = function ({ body = {}, headers = {}, status = 200 }) {
        return {
          body,
          headers,
          status,
        };
      };

      ctx.redirect = function ({
        location = "/",
        headers = {},
        status = 303,
        body = {},
      } = {}) {
        return ctx.respond({
          status,
          headers: {
            ...headers,
            location,
          },
          body,
        });
      };
    },
    onStart(ctx) {
      ctx.addLayout(adminPrefix, {
        async load(req) {
          console.log("calling load of admin layout");
          let user;
          try {
            console.log(req.headers.cookie);
            user = await ctx.getUserInfo(req.headers.cookie);
          } catch (err) {
            user = null;
          }

          return {
            logo: logoComponent(),
            user,
            title: defaultTitle,
            sidebar: ctx.getSidebarItems(),
          };
        },
        actions: {
          async logout() {
            const { cookie } = ctx.logout();

            return {
              status: 303,
              headers: {
                location: "/login",
                "set-cookie": cookie,
              },
            };
          },
        },
        component: adminLayoutComponent,
      });

      ctx.addPage(loginRoute, {
        page: loginPageComponent,
        actions: {
          async login({ body }) {
            try {
              const { cookie } = await ctx.login(body);
              //

              return ctx.redirect({
                location: adminPrefix,
                headers: {
                  "set-cookie": cookie,
                },
              });
            } catch (err) {
              return ctx.redirect({
                location: loginRoute,
                body: {
                  message: err.message,
                },
              });
            }
          },
        },
      });

      ctx.addSidebarItem({
        href: adminPrefix,
        title: "Dashboard",
        icon: "dashboard",
      });
      ctx.addPage(adminPrefix, {
        page: adminPage,
      });
    },
  };
}
