import React, { Component } from "../../../../node_modules/react"

const NoteText = ({ toggle = "false", noteInput = f => f, editHistory = f => f, note = {} }) => {
  const editMode = note.editMode || false
  let _textArea
  const submit = () => {
    noteInput(_textArea.innerText, note.id)
    editHistory(_textArea.innerText, note.id)
    toggle(!editMode, note.id)
  }
  const textDisplay = () => {
    _textArea.focus()
    if (!editMode) {
      toggle(!editMode, note.id)
    }
  }
  const handleReturn = (e) => {
    console.log(e.shiftKey);
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }
  return (
    <div
      contentEditable={editMode}
      className="note-editable"
      ref={input => _textArea = input}
      onBlur={submit}
      onClick={textDisplay}
      onKeyPress={handleReturn}
      placeholder="Enter note text ..."
    >
      {note.text}
    </div>
  )
}

NoteText.propTypes = {
  toggle: React.PropTypes.func,
  noteInput: React.PropTypes.func,
  editHistory: React.PropTypes.func,
  note: React.PropTypes.object,
}

const NoteTextSaved = ({ id="default", saveID, saveStatus }) => {
  return (
  <div
    className = {saveStatus && saveID ===id ? "saved-overlay active": "saved-overlay"}
  >
    Saved
  </div> )
}

export {NoteText, NoteTextSaved}
