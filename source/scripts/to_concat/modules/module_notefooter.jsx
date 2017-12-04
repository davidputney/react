import React, { Component } from "../../../../node_modules/react"

import { Button, CloseButton, RevertButton, RestoreButton } from "./module_buttons"
import Checkbox from "./module_checkbox"
import { SelectDropdown, ListItem, Select } from "./module_dropdown";
import Assigned from "./module_assigned"
import { ColorPicker, ColorSwatch } from "./module_colorpicker";

const NoteFooter = ({ colors, id, selectColor, action, label, checked, checkChange, text, list, dropAction }) =>
  <footer
  className="note-footer">
    <ColorPicker
      colors={colors}
      id={id}
      selectColor={selectColor}
    />
    <div>
      <RevertButton
        action={action}
        id={id}
        label={label}
      />
      <RestoreButton
        action={action}
        id={id}
        label={label}
      />
    </div>
    <div
      className="notes-status">
      <Checkbox
        checked={checked}
        checkChange={checkChange}
      />
      <SelectDropdown
        text={text}
        list={list}
        id={id}
        action={dropAction}
      />
      <Assigned
        text={text}
        list={list}
        id={id}
        action={dropAction}
      />
    </div>
  </footer>

  export {NoteFooter, Button, CloseButton, RevertButton, RestoreButton, Checkbox, Assigned, SelectDropdown, ListItem, Select, ColorPicker, ColorSwatch}
