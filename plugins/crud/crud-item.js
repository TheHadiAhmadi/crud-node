import { FormPage, TablePage } from "./views.js";

export function initCrudItem({ item, ctx }) {
  const CrudFields = ctx.getModel("crud_fields");
  ctx.addSidebarItem({
    icon: item.icon,
    href: ctx.adminPrefix + "/" + item.table_name,
    title: item.title_sidebar,
  });

  ctx.addPage(ctx.adminPrefix + "/" + item.table_name, {
    async load(req) {
      const items = await ctx.getModel(item.table_name).query({ perPage: 100 });

      const fields = await CrudFields.query({
        where: { crud_id: item.id },
      });
      // query fields
      const columns = fields.data;

      console.log(items.data);
      return {
        title: item.title_list,
        url: req.url,
        data: items.data,
        columns,
      };
    },
    page: TablePage,
  });

  ctx.addPage(ctx.adminPrefix + "/" + item.table_name + "/add", {
    // title, action, fields, value
    actions: {
      async create({ body }) {
        console.log(body);

        await ctx.getModel(item.table_name).insert(body);

        return ctx.redirect({
          locatin: ctx.adminPrefix + "/" + item.table_name,
        });
      },
    },
    async load(req) {
      const fields = await ctx.getModel("crud_fields").query({
        where: { crud_id: item.id },
      });
      fields.props = JSON.parse(fields.props ?? "{}");

      return {
        //
        fields: fields.data.map((field) => ({
          name: field.name,
          label: field.label,
          type: field.input_type,
          ...field.props,
        })),
        action: "create",
        title: item.title_insert,
        value: {},
      };
    },
    page: FormPage,
  });

  ctx.addPage(ctx.adminPrefix + "/" + item.table_name + "/:id/edit", {
    // title, action, fields, value
    actions: {
      async update({ body, params }) {
        await ctx.getModel(item.table_name).update(params.id, body);

        return ctx.redirect({
          locatin: ctx.adminPrefix + "/" + item.table_name,
        });
      },
    },
    async load(req) {
      const data = await ctx.getModel(item.table_name).get(+req.params.id);

      const fields = await CrudFields.query({
        where: { crud_id: item.id },
      });
      fields.props = JSON.parse(fields.props ?? "{}");

      return {
        //
        fields: fields.data.map((field) => ({
          name: field.name,
          label: field.label,
          props: field.props,
          type: field.input_type,
        })),
        action: "update",
        title: item.title_update,
        value: data,
      };
    },
    page: FormPage,
  });
}
