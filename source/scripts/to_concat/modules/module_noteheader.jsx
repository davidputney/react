import React, { Component } from "../../../../node_modules/react"
import {Button, CloseButton, RevertButton, RestoreButton} from "./module_buttons"

const NoteHeader = ({action, id}) =>
  <header
  className="note-header">
    <CloseButton
      action={action}
      id={id}
    />
  </header>

export {NoteHeader, Button}
