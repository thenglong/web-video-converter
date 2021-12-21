import { CircularProgressbar } from "react-circular-progressbar";

export default function Progress({ precentage }) {
  return (
    <div style={{ width: 200, height: 200 }}>
      <CircularProgressbar
        value={precentage}
        text={`${Math.floor(precentage)}%`}
      />
    </div>
  );
}
