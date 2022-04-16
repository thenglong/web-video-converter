import { CircularProgressbar } from "react-circular-progressbar"

export default function Progress({ precentage, ...props }) {
  return (
    <div {...props}>
      <CircularProgressbar
        value={precentage}
        text={`${Math.floor(precentage)}%`}
      />
    </div>
  )
}
