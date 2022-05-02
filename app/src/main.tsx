import React from "react";
import ReactDOM from "react-dom";

import ReactOpenWallet from "react-open-wallet";
import App from "./components/App";

ReactDOM.render(
  <ReactOpenWallet hideButton>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ReactOpenWallet>,
  document.getElementById("root")
);
