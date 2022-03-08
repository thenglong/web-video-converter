import { useCallback } from "react"

import classnames from "classnames"
import { Button } from "elementz"
import { useDropzone } from "react-dropzone"

import { useAppContext } from "../../context/AppContext"

const SourceMediaDropzone = () => {
  const { setMediaSrc, mediaSrc } = useAppContext()
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
    isDragAccept,
    isDragReject,
    open: openFileDialog,
  } = useDropzone({
    onDrop,
    accept: "video/*",
    maxFiles: 1,
    noClick: true,
  })
  return (
    <div
      {...getRootProps()}
      className={classnames("source-root", {
        "source-root--active": isDragAccept,
        "source-root--rejected": isDragReject,
      })}
    >
      <input {...getInputProps()} />

      {isDragAccept && <p>Drop here</p>}
      {isDragReject && <p>Unsupported file</p>}

      {!isDragActive && (
        <>
          <Button onClick={openFileDialog} primary>
            Browse Video
          </Button>
          <p>
            Drag and drop video file here, or click to
            select a file
          </p>
        </>
      )}
    </div>
  )
}

export default SourceMediaDropzone
