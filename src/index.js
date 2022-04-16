import { StrictMode } from "react"

import "react-circular-progressbar/dist/styles.css"
import { createRoot } from "react-dom/client"
import { RecoilRoot } from "recoil"

import App from "./App"
import { AppProvider } from "./context/AppContext"
import reportWebVitals from "./reportWebVitals"

import "./styles/global.css"

const container = document.getElementById("root")
const root = createRoot(container) // createRoot(container!) if you use TypeScript
root.render(
  <StrictMode>
    <RecoilRoot>
      <AppProvider>
        <App />
      </AppProvider>
    </RecoilRoot>
  </StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
