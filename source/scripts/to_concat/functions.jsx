import colors from "./modules/colors"
import React, { Component } from "../../../node_modules/react"
import ReactDOM from "../../../node_modules/react-dom"
import { Children, PropTypes } from 'react'

// import { newPostKey, writeNewPost, cleanData, getData } from "./modules/firebaseFoo";

import Checkbox from "./modules/module_checkbox"
import { SelectDropdown, ListItem, Select } from "./modules/module_dropdown";
import { ColorPicker, ColorSwatch } from "./modules/module_colorpicker";
import { NoteText, NoteTextSaved } from "./modules/module_notetext";
import { Button, CloseButton, RevertButton, RestoreButton } from "./modules/module_buttons"
import NewNote from "./modules/module_newnote"
import Assigned from "./modules/module_assigned"
import {Loader, Failed} from "./modules/module_loaders"

const app = document.querySelector("#app")

console.log("foo bar");

let notesCont = []
let notesHash = []
let namesList = notesCont.map(note => note.assigned)

const createNotesHash = r => {
  notesHash = r.map(el => el.id)
}

namesList = namesList.filter((elem, index, self) => index == self.indexOf(elem))
namesList.push("Unassigned")

const editStates = []
const rando = () => Math.floor((Math.random() * 4) + 1);

// creates a new key in the database and returns key value
// used to creating a new post
const newPostKey = database => database.ref("/notes/").child('notes').push().key;

// // writes to DB. gets value and a path
// const writeNewPost = (value=null, path='notes/') => {
//   console.log("value", value);
//   firebase.database().ref(path).update(value)
//   const p = new Promise((resolve, reject) => {
//     firebase.database().ref(path).on('value', snapshot => snapshot ? resolve(snapshot.val()) : reject("error"))
//   })
//   return p
// }

console.log("firebase foo");

// const writeNewPost = (value=null, id, f) => {
//   firebase.database().ref(`notes/${id}`).update(value, error => {
//     error? f(false, id): f(true, id)
//     }
//   )
// }

const cleanData = (data => Object.keys(data).map(id => ({...data[id], id})))
// get data
const getData = (path="notes/") =>
  new Promise((resolve, reject) => {
    firebase.database().ref(path).on("value", snapshot => snapshot ? resolve(snapshot): reject("error"))
  })






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
    const i = notesHash.indexOf(id)
    notes.notesCont[i].text = val
    this.setState(notes, (idfoo = id, valfoo = val) => this.handleNoteSave(idfoo, valfoo))
  }
  writeNewPost(value=null, id, f) {
    firebase.database().ref(`notes/${id}`).update(value, error => error? this.handleNoteSaveFail(id): this.handleSaveSucceess(id)
    )
  }
  handleNoteSave(id, val) {
    this.setState({ saveStatus: false, saveID: null }, ( () => this.writeNewPost({text: val}, id, this.handleSave)
    ))
  }
  handleNoteSaveFail(val) {
    console.log("fail");
  }
  handleSaveSucceess(id) {
    console.log("save worked");
    this.setState({ saveStatus: true, saveID: id })
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
