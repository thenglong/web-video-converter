import { useCallback } from "react"

import { Button } from "elementz"
import { useDropzone } from "react-dropzone"

import "./SourceMedia.css"
import { useAppContext } from "../../context/AppContext"

const SourceMedia = () => {
  const { setMediaSrc, mediaSrc } = useAppContext()
  const { blobUrl } = mediaSrc.info || {}

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles?.[0]
      if (file) {
        setMediaSrc(file)
      }
    },
    [setMediaSrc]
  )

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    open: openFileDialog,
  } = useDropzone({
    onDrop,
    accept: "video/*",
    maxFiles: 1,
  })

  return (
    <div style={{ width: "40%" }}>
      <Button onClick={openFileDialog}>Open</Button>

      <div {...getRootProps()} className="source-root">
        <input {...getInputProps()} />

        {isDragReject && "REjected"}

        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>
            Drag and drop some files here, or click to
            select files
          </p>
        )}
      </div>

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
