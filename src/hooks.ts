import { useEffect, useState } from 'react'

import {
  EventEmitter,
  EVENT_NAVIGATION,
  KEY_SCENE_ID,
  KEY_ON,
  ON_COMPONENT_RESULT,
  ON_COMPONENT_DISAPPEAR,
  ON_COMPONENT_APPEAR,
  ON_DIALOG_BACK_PRESSED,
  KEY_REQUEST_CODE,
  KEY_RESULT_CODE,
  KEY_RESULT_DATA,
} from './NavigationModule'

export function useVisibleState(sceneId: string) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const subscription = EventEmitter.addListener(EVENT_NAVIGATION, data => {
      if (sceneId === data[KEY_SCENE_ID]) {
        if (data[KEY_ON] === ON_COMPONENT_APPEAR) {
          setVisible(true)
        } else if (data[KEY_ON] === ON_COMPONENT_DISAPPEAR) {
          setVisible(false)
        }
      }
    })
    return () => {
      subscription.remove()
    }
  }, [sceneId])
  return visible
}

export function useBackEffect(sceneId: string, fn: () => void) {
  useEffect(() => {
    const subscription = EventEmitter.addListener(EVENT_NAVIGATION, data => {
      if (sceneId === data[KEY_SCENE_ID] && data[KEY_ON] === ON_DIALOG_BACK_PRESSED) {
        fn()
      }
    })

    return () => {
      subscription.remove()
    }
  }, [fn, sceneId])
}

export function useResult(
  sceneId: string,
  fn: (requestCode: number, resultCode: number, data: { [x: string]: any }) => void,
) {
  useEffect(() => {
    const subscription = EventEmitter.addListener(EVENT_NAVIGATION, data => {
      if (sceneId === data[KEY_SCENE_ID] && data[KEY_ON] === ON_COMPONENT_RESULT) {
        fn(data[KEY_REQUEST_CODE], data[KEY_RESULT_CODE], data[KEY_RESULT_DATA])
      }
    })

    return () => {
      subscription.remove()
    }
  }, [fn, sceneId])
}
