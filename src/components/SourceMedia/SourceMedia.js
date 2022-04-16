import { Button } from "elementz"

import { useAppContext } from "../../context/AppContext"
import SourceMediaDropzone from "./SourceMediaDropzone"

import "./SourceMedia.css"

const SourceMedia = () => {
  const { mediaSrc } = useAppContext()
  const { blobUrl } = mediaSrc.info || {}

  if (!blobUrl) return <SourceMediaDropzone />

  return (
    <div style={{ width: "100%" }}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        // className="video-preview"
        style={{ width: "100%" }}
        src={blobUrl}
        controls
      />
      <Button primary>Change Source</Button>
      <pre>
        {mediaSrc.info &&
          JSON.stringify(mediaSrc.info, null, 2)}
      </pre>
    </div>
  )
}

export default SourceMedia
