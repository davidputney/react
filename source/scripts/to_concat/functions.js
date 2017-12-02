import colors from "./modules/colors"

import React, { Component } from "../../../node_modules/react"
import ReactDOM from "../../../node_modules/react-dom"
import { Children, PropTypes } from 'react'

import { newPostKey, writeNewPost, cleanData, getData } from "./modules/firebase";


const app = document.querySelector("#app")
const database = firebase.database()


let notesCont = []
let notesHash = []
let namesList = notesCont.map(note => note.assigned)


const createNotesHash = r => {
  notesHash = r.map(el => el.id)
}

// console.log("hash", createNotesHash(notesCont));


namesList = namesList.filter((elem, index, self) => index == self.indexOf(elem))
namesList.push("Unassigned")


const editStates = []

const rando = () => Math.floor((Math.random() * 4) + 1);

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

const Select = ({ item }) =>
  <option>{item}</option>

Select.propTypes = {
  item: React.PropTypes.string,
}
Select.defaultProps = {
  item: "",
}

const ListItem = ({ action, text, id }) => {
  let _listItem
  const listSelect = () => {
    action(text, id)
  }
  return (
    <li
      onClick={listSelect}
    >
      {text}
    </li>
  )
}

ListItem.propTypes = {
  action: React.PropTypes.func,
  text: React.PropTypes.string,
  id: React.PropTypes.string,
}

ListItem.defaultProps = {
  action: f => f,
  text: "",
  id: "",
}

const SelectDropdown = ({ action = f => f, text = "", list = [], id = "" }) =>
  <div className="select">
    <p>Assigned to</p>
    <ul aria-hidden="true">
      <li className="selector"> {list.map(name => name === text ? name : false)}
        <ul>
          {list.map((name, i) =>
            name !== text ? <ListItem action={action} id={id} text={name} key={i} /> : false)}
          </ul>
        </li>
    </ul>
  </div>

SelectDropdown.propTypes = {
  action: React.PropTypes.func,
  text: React.PropTypes.string,
  list: React.PropTypes.array,
  id: React.PropTypes.string,
}
SelectDropdown.defaultProps = {
  action: f => f,
  text: "",
  list: [],
  id: "",
}

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

const NoteHeader = ({action, id}) =>
  <header
  className="note-header">
    <CloseButton
      action={action}
      id={id}
    />
  </header>

const NoteContent = ({noteInput, editHistory, toggle, note, id, saveStatus, saveID }) =>
    <div
    className="note-content">
      <NoteTextSaved
        id={id}
        saveStatus={saveStatus}
        saveID={saveID}
      />
      <NoteText
        noteInput={noteInput}
        editHistory={editHistory}
        toggle={toggle}
        note={note}
    />
  </div>

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


const NoteToo = ({  handleNoteRemove, singleNote, noteInput, editHistory, handleEditToggle, saveStatus, saveID, colors, handleColorPicker, handleRevert, checkChange, namesList, handleAssigned }) => {
    return (
      <article
        className={`note ${singleNote.color}`}
        id={`note-${singleNote.id}`}
      >
        <NoteHeader
          action={handleNoteRemove}
          id={singleNote.id}
        />
        <NoteContent
          noteInput={noteInput}
          editHistory={editHistory}
          toggle={handleEditToggle}
          note={singleNote}
          id={singleNote.id}
          saveStatus={saveStatus}
          saveID={saveID}
        />
        <NoteFooter
          colors={colors}
          id={singleNote.id}
          selectColor={handleColorPicker}
          action={handleRevert}
          label={"Revert"}
          checked={singleNote.done}
          checkChange={checkChange}
          text={singleNote.assigned}
          list={namesList}
          dropAction = {handleAssigned}
        />
      </article>
    )
  }

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { notesCont, editStates, loading: false, count: 0, saveStatus: false, saveID: "default-save-x" }
    this.handleCheck = this.handleCheck.bind(this)
    this.handleNoteText = this.handleNoteText.bind(this)
    this.handleEditHistory = this.handleEditHistory.bind(this)
    this.handleRevert = this.handleRevert.bind(this)
    this.handleAssigned = this.handleAssigned.bind(this)
    this.handleEditToggle = this.handleEditToggle.bind(this)
    this.handleNoteRemove = this.handleNoteRemove.bind(this)
    this.handleNewNote = this.handleNewNote.bind(this)
    this.handleColorPicker = this.handleColorPicker.bind(this)
    this.handleReload = this.handleReload.bind(this)
  }
  componentWillMount() {
    this.setState({ loadFailed:false, loading: true })
    getData()
    .then(
      data => cleanData(data.val())
    )
    .then(notesCont => {
      this.setState({ notesCont, loading:false, loadFailed:false }, createNotesHash(notesCont)) }
    ).catch(
      // err => this.handleLoadFail(err)
      // error here
    )
  }
  handleLoadFail(err=false) {
    if (err) {
      this.setState({ loadFailed:true, loading:false })
    }
  }
  handleReload() {
    let url = rando() === 1 ? "notes/" : "notes/"
    this.setState({ loadFailed:false, loading: true })
    getData(url)
    .then(
      data => cleanData(data.val())
    )
    .then(notesCont => {
      this.setState({ notesCont, loading:false, loadFailed:false })
    }).catch(
      err => this.handleLoadFail(err)
    )
  }
  handleNewNote() {
    const notes = { ...this.state }
    const newNote = { text: "this is a new note", assigned: "Unassigned", done: false, editMode: true, checked: false }

    const key = newPostKey(database);
    writeNewPost(newNote, `notes/${key}`)

    getData(`notes/${key}`).then(snapshot => {
      let notesCont = snapshot
      notesCont.id = key;
      notes.notesCont.push(newNote)
      this.setState(notes)
    })
  }
  handleNoteRemove(id) {
    let notes = { ...this.state }
    let toRemove
    notes.notesCont = notes.notesCont.filter(note => id !== note.id)
    this.setState(notes)
  }
  handleCheck(id) {
  let notes = { ...this.state }
    notes = notes.notesCont.map((note, i) => {
      note.done = (id === note.id) ? !note.done : note.done
    })
    this.setState(notes)
  }
  handleColorPicker(id, value) {
    let notesCont = [...this.state.notesCont]
    notesCont
      .filter(note => id === note.id)
      .map((note, i) => {
        note.color = value
    })
    this.setState({ notesCont })
  }
  handleNoteText(val, id) {
    let notes = { ...this.state }
    // console.log("index", notesHash.indexOf(id));
    // console.log("id", id);
    // console.log(notesHash);
    const i = notesHash.indexOf(id)
    notes.notesCont[i].text = val
    // notes.notesCont.map(note =>
    //   note.text = (id === note.id) ? val: note.text)
    this.setState(notes, (idfoo = id, valfoo = val) => this.handleNoteSave(idfoo, valfoo))
  }
  handleNoteSave(id, val) {
    this.setState({ saveStatus: false, saveID: null }, () =>
      writeNewPost({text: val},`notes/${id}`)
      .then (
        foobar => foobar.text === val? this.handleSaveSucceess(id): this.handleNoteSaveFail(val, id, "then")
      )
      .catch (
        this.handleNoteSaveFail(val, id, "catch")
      // failure handler
      )
    )
  }
  handleNoteSaveFail(val, id, string) {


  }
  handleSaveSucceess(id) {
    console.log("save worked");
    this.setState({ saveStatus: true, saveID: id }, (valu = this.state) => console.log("save success", valu))
  }
  handleEditToggle(val, id) {
    let notes = { ...this.state }
    notes = notes.notesCont.map(note => {
      if (id === note.id) {
        note.editMode = val
      }
    })
    notes.saveStatus = false;
    notes.saveID = null;
    this.setState(notes)
  }
  handleEditHistory(val, id) {
    const editsList = { ...this.state }
    let i
    editsList.editStates.some((el, indx) => {
      i = (el.id === id) ? indx : false
      return typeof i === "number"
    })
    if (i && typeof i === "number") {
      editsList.editStates[i].edits.push(val)
    } else {
      const myObject = { id: id, edits: [val] }
      editsList.editStates.push(myObject)
    }
    this.setState(editsList)
  }
  handleAssigned(val, id) {
    let notes = { ...this.state }
    notes = notes.notesCont.map(note => note.assigned = (id === note.id) ? val : note.assigned)
    this.setState(notes)
  }
  handleRevert(id) {
    const editsList = { ...this.state }
    // i=which one matches -- index of false
    // l=laZZFCength of edit chain -- length or false
    let i = false
    let l = false
    editsList.notesCont.some((el, indx) => {
      if (el.id === id) {
        i = indx
        l = editsList.notesCont[indx].edits.length - 1
      }
      return el.id === id
    })
    // get entry that will be changed
    let e
    editsList.notesCont.some((el, indx) => {
      if (el.id === id) {
        e = indx
      }
      return el.id === id
    })
    if (typeof (i) === "number" && l > 1) {
      const currIncr = editsList.notesCont[i].increment || false
      const incr = (currIncr) ? currIncr - 1 : l - 1
      editsList.notesCont[i].increment = incr
      editsList.notesCont[e].text = editsList.notesCont[i].edits[incr]
    }
    this.setState(editsList)
  }
  render() {
  const notes = this.state
    return (
      this.state.loading && !this.state.loadFailed ? <Loader /> :
      this.state.loadFailed ?
      <Failed
        action = {this.handleReload}
      /> :
      <div className={this.state.loading? "notes-app": "notes-app active"}>
      {notes.notesCont.map((el, i) => (
          <NoteToo
            singleNote={el}
            namesList={namesList}
            colors={colors}
            checkChange={this.handleCheck}
            noteInput={this.handleNoteText}
            editHistory={this.handleEditHistory}
            handleRevert={this.handleRevert}
            handleAssigned={this.handleAssigned}
            handleEditToggle={this.handleEditToggle}
            handleNoteRemove={this.handleNoteRemove}
            handleColorPicker={this.handleColorPicker}
            key={i}
            handleMount={this.handleMount}
            saveStatus={this.state.saveStatus}
            saveID={this.state.saveID}
          />)
      )}
        <NewNote handleNewNote={this.handleNewNote} />
      </div>
    )
  }
}
ReactDOM.render(
  <App />, app
)
