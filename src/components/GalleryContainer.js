import React, { useReducer } from "react"
import PropTypes from "prop-types"

const actionTypes = {
  SET_GALLERY_INDEX_AND_SHOW_MODAL: "SET_GALLERY_INDEX_AND_SHOW_MODAL",
  CLOSE_GALLERY_MODAL: "CLOSE_GALLERY_MODAL",
}

const DispatchContext = React.createContext(null)

const GalleryContainer = ({ children, setGalleryIndex, closeModal }) => {
  const reducer = (state, action) => {
    switch (action.type) {
      case actionTypes.SET_GALLERY_INDEX_AND_SHOW_MODAL:
        setGalleryIndex(Number(action.payload.index))
        return state
      case actionTypes.CLOSE_GALLERY_MODAL:
        closeModal()
        return state
      default:
        return state
    }
  }

  const [, dispatch] = useReducer(reducer, null)

  return (
    <DispatchContext.Provider value={dispatch}>
      {children}
    </DispatchContext.Provider>
  )
}

GalleryContainer.propTypes = {
  children: PropTypes.element,
  closeModal: PropTypes.func,
  setGalleryIndex: PropTypes.func,
}

export default GalleryContainer
export { DispatchContext, actionTypes }
