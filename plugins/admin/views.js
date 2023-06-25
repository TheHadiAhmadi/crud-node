import {
  Row,
  Col,
  Card,
  Avatar,
  CardBody,
  CardFooter,
  Container,
  Button,
  ButtonGroup,
  View,
  Icon,
  Input,
  Form,
} from "@ulibs/components";
import { PageHeader } from "../../components/index.js";

export function HomePage({ user }) {
  return Container({ size: "lg", mx: "auto" }, [
    Row([
      View({ ms: "auto", p: "md" }, [
        ButtonGroup({ ms: "auto" }, [
          user
            ? undefined
            : Button({ color: "primary", href: "/login" }, "Login"),
          Button({ color: "success", href: "/questions" }, "Questions"),
          user && Button({ color: "dark", href: "/admin" }, "Admin"),
        ]),
      ]),
    ]),
    Row([View({ py: "xl", my: "xl" }, ["Section 1 (links)"])]),
    Row([View({ py: "xl", my: "xl" }, "Section 2")]),
    Row([View({ py: "xl", my: "xl" }, "Section 3")]),
    Row([View({ py: "xl", my: "xl" }, "Section 4")]),
  ]);
}

export function LoginPage() {
  return Container({ size: "xs", px: "md", mx: "auto", mt: "xl", pt: "xl" }, [
    View({ tag: "form", method: "POST", action: "?login" }, [
      Card({ mt: "xl", title: "Login" }, [
        CardBody([
          Row([
            Col({ col: 12 }, Input({ name: "username", label: "Username" })),
            Col(
              { col: 12 },
              Input({ name: "password", type: "password", label: "Password" })
            ),
            // Col({col: 12}, Input({name: 'remember', label: 'Remember Me'})),
          ]),
        ]),
        CardFooter([
          Button({ color: "primary" }, "Login"),
          Button({ link: true, type: "button" }, "Forgot password"),
        ]),
      ]),
    ]),
    Button({ href: "/", my: "md", mx: "auto" }, "Go Back"),
  ]);
}

export function AdminLayout({ logo, title, sidebar = [], user }, slots) {
  function Sidebar() {
    return View(
      {
        tag: "ul",
        style: "padding-left: 0; height: 100%;",
      },
      sidebar.map((item) =>
        View(
          {
            tag: "li",
            style: "list-style-type: none",
          },
          View(
            {
              tag: "a",
              href: item.href,
              style:
                "text-decoration: none; display: flex; color: var(--color-base-800); padding: var(--size-xxs) var(--size-sm);",
            },
            [
              Icon({ name: item.icon }),
              View(
                {
                  style: "display: inline-block; padding-left: var(--size-xs);",
                },
                item.title
              ),
            ]
          )
        )
      )
    );
  }

  function Header() {
    return View(
      {
        style:
          "padding-top: var(--size-xs); padding-bottom: var(--size-xs); background-color: var(--color-base-100); border-bottom: 1px solid var(--color-base-400);",
      },
      [
        Container({ size: "xl", mx: "auto" }, [
          // check if is logged in from props
          Row({ style: "align-items: center;" }, [
            Col({ class: "sm-hide", col: 0 }, Icon({ name: "menu-2" })),
            Col({ col: true }),
            Col({ class: "hide-light" }, [
              Button({ onClick: "toggleTheme()" }, Icon({ name: "sun" })),
            ]),
            Col({ class: "hide-dark" }, [
              Button({ onClick: "toggleTheme()" }, Icon({ name: "moon" })),
            ]),
            user
              ? [
                  Col([Avatar({ color: "info" }, user.name.substring(0, 2))]),
                  Form(
                    { action: "logout" },
                    Col([Button({ color: "error" }, "Logout")])
                  ),
                ]
              : Col([Button({ href: "/login" }, "Login")]),
          ]),
        ]),
      ]
    );
  }

  function Body(props, slots) {
    return Container(
      { size: "xl", mx: "auto", my: "md" },
      user ? slots : Card({ mt: "md" }, [CardBody("You are not logged in!")])
    );
  }

  const script = View(
    { tag: "script" },
    `
      let theme = localStorage.getItem('THEME') ?? 'light'
      if(theme === 'dark') {
        document.body.classList.add('dark')
      }
  
      function toggleTheme() {
        
        if(theme === 'dark') {
          theme = 'light'
        } else {
          theme = 'dark'
        }
        localStorage.setItem('THEME', theme)
        document.body.classList.toggle('dark')
  
      }
    `
  );
  const css = View(
    {
      tag: "style",
    },
    `
    .dark .hide-dark {
      display: none;
    }
    .hide-light {
      display: none;
    }
  
    .dark .hide-light {
      display: unset;
    }


    .admin-page-content {
    }

    .hide {
      display: none;
    }
    @media (min-width: 768px) {
      .sm-show {
        display: unset;
      }
      .sm-hide {
        display: none;
      }
      .admin-page-content {
        margin-left: 240px;
      }
      
    }
    
    `
  );

  return [
    View(
      {
        htmlHead: [title ? `<title>${title}</title>` : "", css],
        class: "sm-show hide",
        style:
          "position: fixed; width: 240px; top: 0; left: 0; height: 100%; background-color: var(--color-base-100); border-right: 1px solid var(--color-base-400);",
      },
      [
        View(
          {
            style: "padding: var(--size-xs) var(--size-sm);",
          },
          logo
        ),
        Sidebar(),
      ]
    ),
    View({ class: "admin-page-content" }, [script, Header(), Body({}, slots)]),
  ];
}

export function AdminPage(props, slot) {
  if (!props.user) return;

  return [
    PageHeader({ title: "Dashboard" }, Button({ href: "/" }, "Home")),
    Card({ mt: "md" }, [CardBody(`Welcome ${props.user.name}!`)]),
  ];
}
