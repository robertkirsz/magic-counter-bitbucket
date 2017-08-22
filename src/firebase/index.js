import firebase from 'firebase'

const prodConfig = {
  apiKey: 'AIzaSyDwDacwAuGy4LxSOJnJKgVDOBSgHQm6PgU',
  authDomain: 'mtg-collection-cd492.firebaseapp.com',
  databaseURL: 'https://mtg-collection-cd492.firebaseio.com',
  projectId: 'mtg-collection-cd492',
  storageBucket: 'mtg-collection-cd492.appspot.com',
  messagingSenderId: '378575387948'
}

const devConfig = {
  apiKey: 'AIzaSyACgpq8QACoKVO_QpZOFz3ugf-fDWQnyN4',
  authDomain: 'magic-card-manager-dev.firebaseapp.com',
  databaseURL: 'https://magic-card-manager-dev.firebaseio.com',
  projectId: 'magic-card-manager-dev',
  storageBucket: 'magic-card-manager-dev.appspot.com',
  messagingSenderId: '295694560951'
}

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig

export const app = firebase.initializeApp(config)
export const auth = firebase.auth()
export const database = firebase.database()

// List of available authentication providers
const providers = {
  google: new firebase.auth.GoogleAuthProvider(),
  facebook: new firebase.auth.FacebookAuthProvider(),
  twitter: new firebase.auth.TwitterAuthProvider(),
  github: new firebase.auth.GithubAuthProvider()
}

// ---------- GENERIC STUFF ----------

// Generic 'get' function
export const firebaseGetData = (table, id) => (
  database
    .ref(table)
    .child(id)
    .once('value')
    .then(snapshot => {
      const data = snapshot.val()
      return data
        ? ({ success: true, data })
        : ({ error: 'No data found' })
    })
)

// Generic 'set' function
export const firebaseSetData = (table, id, data) => (
  database
    .ref(table)
    .child(id)
    .set(data)
    .then(() => ({ success: true }))
    .catch(response => ({ error: response.message }))
)

// Generic 'push' function
export const firebasePushData = (table, data) => (
  database
    .ref(table)
    .push()
    .set(data)
    .then(() => ({ success: true }))
    .catch(response => ({ error: response.message }))
)

// Generic 'update' function
export const firebaseUpdateData = (table, id, data) => (
  database
    .ref(table)
    .child(id)
    .update(data)
    .then(() => ({ success: true }))
    .catch(response => ({ error: response.message }))
)

// 'On' listener
export const firebaseListener = (table, id, callback) => (
  database
    .ref(table)
    .child(id)
    .on('value', snapshot => callback(snapshot.val()))
)

// ---------- AUTHENTICATION ----------

// Generic email and password sign in
export const firebaseSignIn = (email, password) => (
  auth.signInWithEmailAndPassword(email, password)
    .then(response => ({ success: true, id: response.uid, response }))
    .catch(response => ({ error: true, response }))
)

// Generic email and password sign up
export const firebaseSignUp = (email, password) => (
  auth.createUserWithEmailAndPassword(email, password)
    .then(response => ({ success: true, id: response.uid }))
    .catch(response => ({ error: true, response }))
)

// Sign out
export const firebaseSignOut = () => (
  auth.signOut()
    .then(() => ({ success: true }))
    .catch(response => ({ error: response.message }))
)

// Provider sign in
export const firebaseProviderSignIn = (providerName) => (
  auth.signInWithPopup(providers[providerName])
    .then(response => ({ success: true, user: response.user }))
    .catch(response => ({ error: response.message }))
)

// ---------- PROFILE ----------
// TODO: check if needed
export const updateProfile = userProfile => (
  auth.currentUser.updateProfile({
    displayName: userProfile.displayName,
    photoURL: userProfile.photoURL
  })
    .then(() => {
      console.log('Success')
    }, error => {
      console.log('Error', error)
    })
)

export const updateEmail = email => (
  auth.currentUser.updateEmail(email)
    .then(() => {
      console.log('Success')
    }, error => {
      console.log('Error', error)
    })
)

// ---------- USER DATA UPDATING ----------

export const updateUserData = user => {
  if (user.uid) return firebaseUpdateData('Users', user.uid, user)
}

// TODO: check if needed
export const updateAndReturnUserSettings = settings => {
  firebaseUpdateData('Users', auth.currentUser.uid, { settings })
  return settings
}
