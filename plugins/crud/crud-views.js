import * as UI from "@ulibs/components";

export function CrudEdit({ value, crud } = {}) {
  function Field({ field }) {
    function Property(name, value) {
      return [
        UI.View({ tag: "strong" }, name + ":"),
        UI.View({ tag: "span" }, value),
      ];
    }
    console.log({ field });
    return UI.Col({}, [
      UI.Row(
        {
          p: "xxs",
          style:
            "background-color: var(--color-base-100); border-radius: var(--size-xxs); border: 1px solid var(--color-base-300);",
          mb: "xxs",
        },
        [
          UI.Col({ col: 12, colXs: 6 }, Property("name", field.name)),
          UI.Col({ col: 12, colXs: 6 }, Property("type", field.type)),
          UI.Col(
            { col: 12, colXs: 6 },
            Property("input type", field.input_type)
          ),
          UI.Col(
            { col: 12, colXs: 6 },
            Property("show on list", field.show_on_list)
          ),
          UI.Col(
            { col: 12, colXs: 6 },
            Property("show on update", field.show_on_update)
          ),
        ]
      ),
    ]);
  }
  return [
    CrudAdd({ value, action: "update", title: "Edit Crud" }, [
      UI.View({ tag: "h4" }, "Fields:"),
      UI.Col(
        {
          col: 12,
          my: "xxs",
        },
        [, UI.Row([value.fields.map((field) => Field({ field }))])]
      ),

      UI.Button(
        { type: "button", onClick: "openFieldModal()", color: "primary" },
        "Add Field"
      ),

      UI.View({
        script: `
        function openFieldModal() {
          document.getElementById('field-modal').setAttribute('u-modal-open', '')
        }
        function closeFieldModal() {
          document.getElementById('field-modal').removeAttribute('u-modal-open')
        }`,
      }),
    ]),
    UI.Modal({ id: "field-modal", size: "xs" }, [
      UI.Form({ onSubmit: "closeFieldModal()", action: "addField" }, [
        UI.ModalBody([
          UI.View(
            { py: "xs", pb: "sm", tag: "h4" },
            "Add Field for " + value.title_sidebar
          ),
          UI.Row([
            UI.Input({
              type: "hidden",
              name: "crud_id",
              style: "display: none",
              value: value.id,
            }),
            UI.Col(
              { col: 12, colSm: 6 },
              UI.Input({ name: "name", label: "Name: " })
            ),
            UI.Col(
              { col: 12, colSm: 6 },
              UI.Input({ name: "label", label: "Label: " })
            ),
            UI.Col(
              { col: 12, colSm: 6 },
              UI.Input({ name: "type", label: "Type (database): " })
            ),
            UI.Col(
              { col: 12, colSm: 6 },
              UI.Input({ name: "input_type", label: "Type (componentName): " })
            ),

            UI.Col(
              { col: 12, colSm: 6 },
              UI.Checkbox({ name: "show_on_list", label: "Show on List? " })
            ),
            UI.Col(
              { col: 12, colSm: 6 },
              UI.Checkbox({ name: "show_on_update", label: "Show on Update? " })
            ),
            UI.Col(
              { col: 12 },
              UI.View({ tag: "textarea", component: "input", name: "props" })
            ),

            UI.ButtonGroup({ p: "xs", ms: "auto" }, [
              UI.Button(
                { type: "button", onClick: "closeFieldModal()" },
                "Cancel"
              ),
              UI.Button({ color: "primary" }, "Submit"),
            ]),
          ]),
        ]),
      ]),
    ]),
  ];
}

export function CrudAdd(
  { value = {}, fields = [], title = "Add Crud", action = "create" },
  slots
) {
  return [
    UI.Form({ action }, [
      UI.Card([
        UI.Row({ p: "xs", style: "align-items: center;" }, [
          UI.Col(
            { col: 0 },
            UI.Button(
              {
                type: "button",
                onClick: "window.location = document.referrer",
                size: "lg",
                link: true,
              },
              UI.Icon({ name: "arrow-left" })
            )
          ),
          UI.Col({ col: true }, UI.View({ tag: "h3" }, title)),
        ]),
        //
        UI.CardBody([
          UI.Row([
            // title_sidebar: 'string',
            // title_list: "string",
            // title_insert: 'string',
            // title_update: 'string',
            UI.Col(
              { col: 8, colXs: 6, colMd: 6 },
              UI.Input({
                name: "table_name",
                placeholder: "users, products, tags....",
                label: "Table name:",
                value: value.table_name,
              })
            ),
            UI.Col(
              { col: 4, mt: "lg" },
              UI.Checkbox({
                name: "create_table",
                checked: value.create_table,
                label: "Create?",
              })
            ),
            UI.Col({ col: 12 }),

            UI.Col(
              { col: 4, colXs: 2, colLg: 1 },
              UI.Input({
                name: "icon",
                label: "Icon:",
                placeholder: "user, star, tag....",
                value: value.icon,
              })
            ),
            UI.Col(
              { col: 8, colXs: 4, colLg: 2 },
              UI.Input({
                name: "title_sidebar",
                placeholder: "Users, Products, Tags....",
                label: "Title (sidebar)",
                value: value.title_sidebar,
              })
            ),
            UI.Col(
              { col: 12, colXs: 6, colLg: 3 },
              UI.Input({
                name: "title_list",
                placeholder: "User List, Product List....",
                label: "Title (list page)",
                value: value.title_list,
              })
            ),
            UI.Col(
              { col: 12, colXs: 6, colLg: 3 },
              UI.Input({
                name: "title_insert",
                placeholder: "Add User, Add Product....",
                label: "Title (insert page)",
                value: value.title_insert,
              })
            ),
            UI.Col(
              { col: 12, colXs: 6, colLg: 3 },
              UI.Input({
                name: "title_update",
                placeholder: "Edit User, Edit Product....",
                label: "Title (update page)",
                value: value.title_update,
              })
            ),

            slots,
          ]),
        ]),
        UI.CardFooter([
          UI.CardActions([
            UI.ButtonGroup([
              UI.Button({ type: "reset" }, "Reset"),
              UI.Button({ color: "primary" }, "Submit"),
            ]),
          ]),
        ]),
      ]),
    ]),
  ];
}
export function CrudTable(props, slots) {
  function Row(row) {
    return UI.TableRow([
      UI.TableCell(row.id),
      UI.TableCell(row.title_sidebar),
      UI.TableCell([
        UI.View({ style: "display: flex; gap: var(--size-xs);" }, [
          UI.Button({ size: "sm", href: props.url + "/" + row.id }, [
            UI.Icon({ name: "eye" }),
          ]),
          UI.Button(
            {
              color: "warning",
              size: "sm",
              href: props.url + "/" + row.id + "/edit",
            },
            [UI.Icon({ name: "pencil" })]
          ),
          UI.Form({ action: "remove" }, [
            UI.Input({
              type: "hidden",
              style: "display: none",
              name: "id",
              value: row.id,
            }),
            UI.Button({ color: "error", size: "sm" }, [
              UI.Icon({ name: "trash" }),
            ]),
          ]),
        ]),
      ]),
    ]);
  }

  return [
    UI.Card([
      UI.Row({ p: "xs", px: "md", style: "align-items: center;" }, [
        // UI.Col(
        //   { col: 0 },
        //   UI.Button({
        //     size: "lg",
        //     link: true,
        //   })
        // ),
        UI.Col({ col: true }, UI.View({ tag: "h3" }, "Crud List")),
        UI.Col({ col: 0 }, [
          UI.Button({ href: props.url + "/add", color: "primary" }, [
            UI.Icon({ name: "plus" }),
            "Add",
          ]),
        ]),
      ]),
      //
      UI.Table([
        UI.TableHead([
          UI.TableCell("ID"),
          UI.TableCell("Name"),
          UI.TableCell({ style: "width: 0" }, "Actions"),
        ]),
        UI.TableBody(props.data.map(Row)),
      ]),
    ]),
  ];
}
