// Crud Plugin
import { TablePage, FormPage } from "./views.js";
import { CrudAdd, CrudEdit, CrudTable } from "./crud-views.js";
import { initCrudItem } from "./crud-item.js";

export default function CrudPlugin({} = {}) {
  return {
    onStart(ctx) {
      const Cruds = ctx.getModel("cruds");
      const CrudFields = ctx.getModel("crud_fields");

      console.log("start crud plugin");
      ctx.addSidebarItem({
        href: ctx.adminPrefix + "/crud",
        title: "Manage Cruds",
        icon: "database",
      });

      Cruds.query({ perPage: 100 }).then(({ data }) => {
        data.map((item) => {
          initCrudItem({ item, ctx });
        });
      });

      ctx.addPage(ctx.adminPrefix + "/crud", {
        async load() {
          const cruds = await Cruds.query({ perPage: 100 });

          console.log(cruds);

          return {
            data: cruds.data,
          };
        },
        actions: {
          async remove({ body }) {
            const crud = await Cruds.get(+body.id);

            await Cruds.remove(+body.id);

            if (crud.create_table) {
              await ctx.removeTable(crud.table_name);
            }

            return ctx.redirect(ctx.adminPrefix + "/crud");
          },
        },
        page: CrudTable,
      });

      ctx.addPage(ctx.adminPrefix + "/crud/add", {
        actions: {
          async create(req) {
            const body = req.body;
            await Cruds.insert(body);

            if (body.create_table) {
              await ctx.createTable(body.table_name, {});
            }

            return ctx.redirect(ctx.adminPrefix + "/crud");
          },
        },
        page: CrudAdd,
      });

      ctx.addPage(ctx.adminPrefix + "/crud/:id/edit", {
        async load({ params }) {
          const data = await ctx.getModel("cruds").get(+params.id);

          const fields = await CrudFields.query({
            where: { crud_id: +params.id },
          });
          console.log({ fields });

          data.fields = fields.data;
          console.log("data: ", data);
          return {
            //
            crud: fields.data[0],
            value: data,
          };
        },
        actions: {
          async update(req) {
            //
          },
          async addField(req) {
            const body = req.body;
            console.log("addField: ", body);
            body.crud_id = +body.crud_id;
            body.props = JSON.stringify(body.props ?? {});

            await CrudFields.insert(body);

            const fields = await CrudFields.query({
              where: {
                crud_id: body.crud_id,
              },
              perPage: 100,
            });

            const crud = await Cruds.get(body.crud_id);
            if (crud.create_table) {
              await ctx.removeTable(crud.table_name);
              const columns = {};

              fields.data.map((field) => {
                columns[field.name] = field.type;
              });

              await ctx.createTable(crud.table_name, columns);
            }

            return ctx.redirect(ctx.adminPrefix + "/crud");
          },
        },
        page: CrudEdit,
      });
    },

    async onInstall(ctx) {
      await ctx.createTable("cruds", {
        table_name: "string",
        fields: "crud_fields[]",
        title_sidebar: "string",
        title_list: "string",
        title_insert: "string",
        title_update: "string",
        icon: "string|default=star",
        create_table: "boolean|default=true",
      });

      await ctx.createTable("crud_fields", {
        crud: "cruds",
        name: "string",
        label: "string",
        type: "string",
        show_on_update: "boolean|default=true",
        show_on_list: "boolean|default=true",
        input_type: "string",
        props: "string", // json
      });
    },

    async onRemove(ctx) {
      await ctx.removeTable("cruds");
      await ctx.removeTable("crud_fields");
    },
  };
}
