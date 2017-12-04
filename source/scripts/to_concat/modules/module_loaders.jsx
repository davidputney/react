import React, { Component } from "../../../../node_modules/react"

const Loader = () =>
  <div className="loader active">
    <h1>Loading</h1>
  </div>

const Failed = ({ action = f => f }) => {
  let _select
  const submit = (e) => {
    e.preventDefault()
    action()
  }
  return (
    <div className="loader active failed">
      <h1
        onClick={submit}
      >
        Failed</h1>
    </div>
  )
}

export {Loader, Failed}
