import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react"

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"
import { useDropzone } from "react-dropzone"

import { ffmpegCorePath, isDev } from "../config/appConfig"
import {
  SET_FFMPEG_STATE,
  SET_MEDIA_OUTPUT,
  SET_MEDIA_SRC_STATE,
  SET_OUTPUT_TYPE,
  SET_PROGRESS_PERCENTAGE,
  START_CONVERT_PROGRESS,
  STOP_CONVERT_PROGRESS,
} from "../constant/AppActionConstants"
import logger from "../utils/loggerUtils"
import { getSimplifiedMediaInfo } from "../utils/mediaUtils"
import reducerLogger from "../utils/reducerLogger"

const ffmpeg = createFFmpeg({
  log: isDev,
  corePath: ffmpegCorePath,
})

export const videoTypeOptions = [
  { value: "mp4", label: "MP4" },
  { value: "mp3", label: "MP3" },
  { value: "mkv", label: "MKV" },
  { value: "webm", label: "WebM" },
]

const initialValue = {
  ffmpegWasm: {
    isLoading: false,
    isLoadingError: false,
    isLoadingSuccess: false,
    error: null,
    ffmpeg: null,
  },
  mediaSrc: {
    file: null,
    info: null,
  },
  convertProgress: {
    percentage: null,
    isConverting: false,
  },
  convertOptions: {
    type: videoTypeOptions[0].value,
  },
  mediaOutput: {
    file: null,
    info: null,
  },
}

const AppContext = createContext(initialValue)

const appReducer = (state = initialValue, action) => {
  switch (action.type) {
    case SET_FFMPEG_STATE:
      return {
        ...state,
        ffmpegWasm: action.payload,
      }
    case SET_MEDIA_SRC_STATE: {
      // check and clear the blobUrl from memory
      const blobUrl = state.mediaSrc.info?.blobUrl
      if (blobUrl) URL.revokeObjectURL(blobUrl)
      return {
        ...state,
        mediaSrc: action.payload,
      }
    }
    case SET_OUTPUT_TYPE: {
      return {
        ...state,
        convertOptions: {
          ...state.convertOptions,
          type: action.payload,
        },
      }
    }
    case SET_PROGRESS_PERCENTAGE: {
      return {
        ...state,
        convertProgress: {
          ...state.convertProgress,
          percentage: action.payload,
        },
      }
    }
    case SET_MEDIA_OUTPUT: {
      return {
        ...state,
        mediaOutput: {
          ...state.mediaOutput,
          ...action.payload,
        },
      }
    }
    case START_CONVERT_PROGRESS: {
      return {
        ...state,
        convertProgress: {
          ...state.convertProgress,
          percentage: 0,
          isConverting: true,
        },
      }
    }
    case STOP_CONVERT_PROGRESS: {
      return {
        ...state,
        convertProgress: {
          ...state.convertProgress,
          percentage: null,
          isConverting: false,
        },
      }
    }
    default:
      throw new Error(
        `Unhandled action type: ${JSON.stringify(
          action,
          null,
          2
        )}`
      )
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    reducerLogger(appReducer),
    initialValue
  )

  useEffect(() => {
    ;(async () => {
      try {
        dispatch({
          type: SET_FFMPEG_STATE,
          payload: {
            isLoading: true,
            isLoadingSuccess: false,
            isLoadingError: false,
            ffmpeg: null,
          },
        })
        await ffmpeg.load()
        dispatch({
          type: SET_FFMPEG_STATE,
          payload: {
            isLoading: false,
            isLoadingSuccess: true,
            isLoadingError: false,
            error: null,
            ffmpeg,
          },
        })
      } catch (error) {
        dispatch({
          type: SET_FFMPEG_STATE,
          payload: {
            isLoading: false,
            isLoadingSuccess: false,
            isLoadingError: true,
            error,
          },
        })
      }
    })()
  }, [])

  const setMediaSrc = useCallback(async (file) => {
    const info = await getSimplifiedMediaInfo(file)
    dispatch({
      type: SET_MEDIA_SRC_STATE,
      payload: {
        file,
        info,
      },
    })
  }, [])

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles?.[0]
      if (file) {
        setMediaSrc(file)
      }
    },
    [setMediaSrc]
  )

  const mediaSrcDropzone = useDropzone({
    onDrop,
    accept: "video/*",
    maxFiles: 1,
    noClick: true,
  })

  const setOutputType = useCallback((type) => {
    dispatch({
      type: SET_OUTPUT_TYPE,
      payload: type,
    })
  }, [])

  const setProgress = useCallback((percentage) => {
    dispatch({
      type: SET_PROGRESS_PERCENTAGE,
      payload: percentage,
    })
  }, [])

  const setMediaOutput = useCallback(async (file) => {
    const info = await getSimplifiedMediaInfo(file)
    dispatch({
      type: SET_MEDIA_OUTPUT,
      payload: { file, info },
    })
  }, [])

  const startProgress = useCallback(() => {
    dispatch({
      type: START_CONVERT_PROGRESS,
    })
  }, [])

  const stopProgress = useCallback(() => {
    dispatch({
      type: STOP_CONVERT_PROGRESS,
    })
  }, [])

  const convert = useCallback(async () => {
    startProgress()

    const { file } = state.mediaSrc || {}
    const { type: targetType } = state.convertOptions || {}

    // start timer
    const start = new Date().getTime()

    const inMemoryFilename = `working-${file?.name}`

    // Write the file to memory
    ffmpeg.FS(
      "writeFile",
      inMemoryFilename,
      await fetchFile(file)
    )

    ffmpeg.setProgress((p) => {
      setProgress(p.ratio * 100)
    })

    // Run the FFMpeg command
    await ffmpeg.run(
      "-i",
      inMemoryFilename,
      `out.${targetType}`
    )

    // Read the result
    const data = ffmpeg.FS("readFile", `out.${targetType}`)

    // Create a URL and set output
    setMediaOutput(
      new Blob([data.buffer], {
        type: `video/${targetType}`,
      })
    )

    // unlink file
    ffmpeg.FS("unlink", inMemoryFilename)

    // end timer
    const end = new Date().getTime()
    const time = end - start
    logger.debug(time / 1000 / 60 + "minutes")

    stopProgress()
  }, [
    setMediaOutput,
    setProgress,
    startProgress,
    state.convertOptions,
    state.mediaSrc,
    stopProgress,
  ])

  return (
    <AppContext.Provider
      value={{
        ...state,
        setMediaSrc,
        mediaSrcDropzone,
        setOutputType,
        convert,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context)
    throw new Error(
      "useAppContext must be used within a AppProvider"
    )

  return context
}
