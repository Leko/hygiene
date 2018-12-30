import { render } from "react-dom";

const App = () => (
  <div>
    {/* FIXME: https://github.com/Leko/hygiene/pull/1 */}
    <span someFix={null} />
  </div>
);

render(App, document.getElementById("root"));
