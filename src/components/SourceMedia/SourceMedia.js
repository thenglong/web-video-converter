import { Button } from "elementz"

import { useAppContext } from "../../context/AppContext"
import SourceMediaDropzone from "./SourceMediaDropzone"

import "./SourceMedia.css"

const SourceMedia = () => {
  const { mediaSrc } = useAppContext()
  const { blobUrl } = mediaSrc.info || {}

  return (
    <div style={{ width: "40%", textAlign: "center" }}>
      {!blobUrl && <SourceMediaDropzone />}
      {blobUrl && (
        <>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            className="video-preview"
            src={blobUrl}
            controls
          />
          <Button primary>Change Source</Button>
        </>
      )}

      <pre>
        {mediaSrc.info &&
          JSON.stringify(mediaSrc.info, null, 2)}
      </pre>
    </div>
  )
}

export default SourceMedia
