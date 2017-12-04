import React, { Component } from "../../../../node_modules/react"

const ColorPicker = ({ colors, id, selectColor }) =>
    <div className="notes-color-picker">
    <div className="notes-picker-icn" >
      <svg className="icn-color" >
        <use xlinkHref="#crayons" / >
      </svg>
      <div className="notes-colors" > {
        colors.map((color, i) =>
          <ColorSwatch
            color={ color.name }
            id = { id }
            selectColor = { selectColor }
            key = { i }
          />
        ) }
      </div>
    </div>
  </div>

ColorPicker.propTypes = {
  colors: React.PropTypes.array,
  selectColor: React.PropTypes.func,
  id: React.PropTypes.string,
}

const ColorSwatch = ({ color, id, selectColor }) => {
  let _radio
  const submit = (e => selectColor(id, color))
  return (
    <div>
      <input id={`${id}${color}`}
        className={color, "color"}
        name={`clrs-${id}`}
        type="radio"
        value={color}
        ref={input => _radio = input}
        onChange={submit}
      />
      <label
        htmlFor={`${id}${color}`}
        className={color}
      >
        {color}
      </label>
    </div>
  )
}
ColorSwatch.propTypes = {
  color: React.PropTypes.string,
  selectColor: React.PropTypes.func,
  id: React.PropTypes.string,
}

export {ColorPicker, ColorSwatch}
