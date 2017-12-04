import React, { Component } from "../../../../node_modules/react"

const NewNote = ({ handleNewNote }) => {
  let _note
  const submit = () => handleNewNote()
  return (
    <div
      className="note"
      ref={input => _note=input}
      onClick={submit}
    >
      <p> new note </p>
    </div>
  )
}
NewNote.propTypes = {
  handleNewNote: React.PropTypes.func,
}

export default NewNote
