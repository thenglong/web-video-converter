import "./SourceMedia.css"
import { useAppContext } from "../../context/AppContext"
import SourceMediaDropzone from "./SourceMediaDropzone"

const SourceMedia = () => {
  const { mediaSrc } = useAppContext()
  const { blobUrl } = mediaSrc.info || {}

  return (
    <div style={{ width: "40%" }}>
      <SourceMediaDropzone />
      {blobUrl && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          style={{
            width: "100%",
            maxHeight: "40rem",
          }}
          src={blobUrl}
          controls
        />
      )}
      <pre>
        {mediaSrc.info &&
          JSON.stringify(mediaSrc.info, null, 2)}
      </pre>
    </div>
  )
}

export default SourceMedia
