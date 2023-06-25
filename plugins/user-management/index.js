import * as cookie from "cookie";

export default function UserManagement({
  cookieKey = "user",
  passwordHashFunction = (str) => str + "_hashed",
} = {}) {
  return {
    updateCtx(ctx) {
      ctx.hashPassword = passwordHashFunction;
    },
    onStart(ctx) {
      const Users = ctx.getModel("users");

      ctx.login = async ({ username, password } = {}) => {
        const user = await Users.query({
          where: {
            username: username + ":=",
            password: ctx.hashPassword(password) + ":=",
          },
        });

        if (user.data.length > 0) {
          return {
            cookie: `${cookieKey}=${user.data[0].id}; HttpOnly; Path=/`,
          };
        } else {
          throw new Error("username or password is invalid!");
        }
      };

      ctx.getUserInfo = async (cookies) => {
        if (!cookies)
          throw new Error("You should pass cookies string to this function");

        const cookiesObject = cookie.parse(cookies ?? "");

        if (!cookiesObject[cookieKey]) {
          throw new Error("You are not logged in");
        }

        const user = await Users.get(cookiesObject[cookieKey]);
        if (!user) {
          throw new Error("You are not logged in");
        }

        delete user["password"];
        user.roles = JSON.parse(user["roles"]);

        return user;
      };

      ctx.logout = () => {
        return {
          cookie: `${cookieKey}=; HttpOnly; Path=/`,
        };
      };
    },
    async onInstall(ctx) {
      await ctx.createTable("users", {
        name: "string|required",
        email: "string",
        username: "string|required",
        password: "string|required",
        roles: "string",
      });

      await ctx.getModel("users").insert({
        name: "Admin",
        password: ctx.hashPassword("1qaz!QAZ"),
        email: "admin@quiz.com",
        username: "admin",
        roles: `["Admin"]`,
      });
    },
    async onRemove(ctx) {
      await ctx.removeTable("users");
    },
  };
}
