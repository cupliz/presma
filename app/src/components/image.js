import React, { useState } from "react"
export default (props) => {
  const [isOpen, setOpen] = useState(false)
  return (
    <div>
      <img
        className="img-small"
        src={props.src}
        onClick={() => setOpen(!isOpen)}
        alt="no image"
      />
      {
        isOpen && (
          <dialog
            className="dialog"
            style={{ position: "absolute" }}
            open
            onClick={() => setOpen(!isOpen)}
          >
            <img
              className="img-big"
              src={props.src}
              onClick={() => setOpen(!isOpen)}
              alt="no image"
            />
          </dialog>
        )
      }
    </div >
  )
}
