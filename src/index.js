import { StrictMode } from "react"

import "react-circular-progressbar/dist/styles.css"
import ReactDOM from "react-dom"
import { RecoilRoot } from "recoil"

import App from "./App"
import reportWebVitals from "./reportWebVitals"

import "./styles/global.css"

ReactDOM.render(
  <StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </StrictMode>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
