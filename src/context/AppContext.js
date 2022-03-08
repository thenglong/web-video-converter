import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react"

import { createFFmpeg } from "@ffmpeg/ffmpeg"

import { isDev } from "../config/appConfig"
import {
  SET_FFMPEG_STATE,
  SET_MEDIA_SRC_STATE,
} from "../constant/AppActionConstants"
import { getSimplifiedMediaInfo } from "../utils/mediaUtils"
import reducerLogger from "../utils/reducerLogger"

const ffmpeg = createFFmpeg({
  log: isDev,
  corePath:
    "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
})

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

  // media config state

  // media output state
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

  return (
    <AppContext.Provider value={{ ...state, setMediaSrc }}>
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
