import { Row, Col, View, ButtonGroup } from "@ulibs/components";
export function PageHeader({ title }, slots) {
  return Row({ my: "md" }, [
    Col({ col: true }, [title && View({ tag: "h3" }, title)]),
    slots && Col({ col: 0 }, ButtonGroup([slots])),
  ]);
}
