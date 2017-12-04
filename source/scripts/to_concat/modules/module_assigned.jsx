import React, { Component } from "../../../../node_modules/react"
import {SelectDropdown, ListItem, Select} from "./module_dropdown";

const Assigned = ({ action = f => f, text = "", list = [], id }) => {
  let _select
  const submit = (e) => {
    e.preventDefault()
    action(_select.value, id)
  }
  return (
    <div className="hidden">
      <p>Select list</p>
      <select
        id="myList"
        value={text}
        ref={select => _select = select}
        onChange={submit}
      >
        { list.map((el, i) => <Select item={el} key={i} />) }
      </select>
    </div>
  )
}
Assigned.propTypes = {
  action: React.PropTypes.func,
  text: React.PropTypes.string,
  list: React.PropTypes.array,
  id: React.PropTypes.string,
}

Assigned.defaultProps = {
  action: f => f,
  text: "",
  list: [],
  id: "",
}

export default Assigned
