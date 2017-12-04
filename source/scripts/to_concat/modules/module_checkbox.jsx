
import React, { Component } from "../../../../node_modules/react"


const Checkbox = ({ checked = "false", checkChange = f => f, id = "" }) => {
  const submit = () => checkChange(id)
  return (
    <form>
      <input
        type="checkbox"
        defaultChecked={checked}
        onChange={submit}
        id={`check${id}`}
      />
      <label htmlFor={`check${id}`} >Done</label>
    </form>
  )
}
Checkbox.propTypes = {
  checked: React.PropTypes.bool,
  checkChange: React.PropTypes.func,
  id: React.PropTypes.string,
}
Checkbox.defaultProps = {
  checked: false,
  checkChange: f => f,
  id: "",
}

export default Checkbox
