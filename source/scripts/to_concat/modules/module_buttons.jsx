import React, { Component } from "../../../../node_modules/react"

const Button = ({ action = f => f, id = "", label = "" }) => {
  let _btn
  const submit = (e) => {
    e.preventDefault()
    action(id)
 }
  return (
    <div>
      <button
        type="submit"
        onClick={submit}
        ref={input => _btn=input}
      >
        {label}
      </button>
    </div>
  )
}
Button.propTypes = {
  action: React.PropTypes.func,
  id: React.PropTypes.string,
  label: React.PropTypes.string,
}

const CloseButton = ({ action, id }) => {
  let _btn
  const submit = (e) => {
    e.preventDefault()
    action(id)
  }
  return (
    <svg
      className="note-close-btn"
      aria-hidden="true"
      onClick={submit}
      ref={input => _btn=input}
    >
      <use xlinkHref="#close_icon" />
    </svg>
  )
}
CloseButton.propTypes = {
  action: React.PropTypes.func,
  id: React.PropTypes.string,
}

const RevertButton = ({ action, id }) => {
  let _btn
  const submit = (e) => {
    e.preventDefault()
    action(id)
  }
  return (
    <svg
      className="note-revert-btn"
      aria-hidden="true"
      onClick={submit}
      ref={input => _btn = input}
    >
      <use xlinkHref="#video-control-previous" />
    </svg>
  )
}

RevertButton.propTypes = {
  action: React.PropTypes.func,
  id: React.PropTypes.string,
}

const RestoreButton = ({ action, id }) => {
  let _btn
  const submit = ((e) => {
    e.preventDefault()
    action(id)
  })
  return (
    <svg
      className="note-revert-btn"
      aria-hidden="true"
      onClick={submit}
      ref = {input => _btn=input}
    >
      <use xlinkHref="#video-control-next" />
    </svg>
  )
}

RestoreButton.propTypes = {
  action: React.PropTypes.func,
  id: React.PropTypes.string,
}

export {Button, CloseButton, RevertButton, RestoreButton}
