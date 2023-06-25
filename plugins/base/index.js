import { connect } from "@ulibs/db";
import { Router } from "@ulibs/router";

import { View } from "@ulibs/components";
import * as ui from "@ulibs/components";

function Layout({ dark }, slots) {
  return View({ tag: "html" }, [
    View({ tag: "head" }, [
      View({ tag: "meta", charset: "UTF-8" }),
      View({
        tag: "meta",
        "http-equiv": "X-UA-Compatible",
        content: "IE=edge",
      }),
      View({
        tag: "meta",
        name: "viewport",
        content: "width=device-width, initial-scale=1.0",
      }),

      View({
        component: "link",
        tag: "link",
        rel: "stylesheet",
        href: "https://unpkg.com/@ulibs/components@next/dist/styles.css",
      }),
      View({
        tag: "script",
        async: true,
        defer: true,
        src: "https://unpkg.com/@ulibs/components@next/dist/ulibs.js",
      }),
    ]),
    View({ tag: "body", class: dark ? "dark" : "" }, slots),
  ]);
}

export default function CmsPlugin({
  port = 3002,
  client = "sqlite3",
  filename = "./app.db",
  dark = false,
  ...rest
} = {}) {
  return {
    updateCtx(ctx) {
      const { createTable, getModel, removeTable } = connect({
        client,
        filename,
        ...rest,
      });
      ctx.createTable = createTable;
      ctx.getModel = getModel;
      ctx.removeTable = removeTable;

      const { startServer, addPage, addLayout, handleRequest } = Router();

      ctx.startServer = startServer;
      ctx.addPage = addPage;
      ctx.addLayout = addLayout;
      ctx.handleRequest = handleRequest;

      ctx.installPlugin = (name, methods) => {
        return pm.install(name, methods);
      };

      ctx.removePlugin = (name) => {
        return pm.remove(name);
      };
      ctx.enablePlugin = (name) => {
        return pm.enable(name);
      };
      ctx.disablePlugin = (name) => {
        return pm.disable(name);
      };

      ctx.ui = ui;
    },

    async onStart(ctx) {
      ctx.addLayout("/", {
        load: (props) => {
          return {
            dark,
            ...props,
          };
        },
        component: Layout,
      });

      ctx.startServer(port);
    },
  };
}
