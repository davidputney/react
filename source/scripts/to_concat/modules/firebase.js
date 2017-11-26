// creates a new key in the database and returns key value
// used to creating a new post
const newPostKey = database => database.ref("/notes/").child('notes').push().key;

// writes to DB. gets value and a path
const writeNewPost = (value=null, path='notes/') => {
  firebase.database().ref(path).update(value)
  const p = new Promise((resolve, reject) => {
    firebase.database().ref(path).on('value', snapshot => snapshot ? resolve(snapshot.val()) : reject("error"))
  })
  return p
}

const cleanData = (data => Object.keys(data).map(id => ({...data[id], id})))

// get data
const getData = (path="notes/") =>
  new Promise((resolve, reject) => {
    firebase.database().ref(path).on("value", snapshot => snapshot ? resolve(snapshot): reject(err))
  })

export {newPostKey, writeNewPost, cleanData, getData}
