import firebase from 'firebase'

const prodConfig = {
  apiKey: 'AIzaSyC0Y6xEG_TSS4ksLxL1RZaOl6m79MRYFtQ',
  authDomain: 'magic-counter-95d70.firebaseapp.com',
  databaseURL: 'https://magic-counter-95d70.firebaseio.com',
  projectId: 'magic-counter-95d70',
  storageBucket: 'magic-counter-95d70.appspot.com',
  messagingSenderId: '457190092071'
}

const devConfig = prodConfig

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
export const firebaseSetData = (table, id, data) =>
  database
    .ref(table)
    .child(id)
    .set(data)
    .then(() => ({ success: true }))
    .catch(response => ({ error: response.message }))

// Generic 'push' function
export const firebasePushData = (table, data) =>
  database
    .ref(table)
    .push()
    .set(data)
    .then(() => ({ success: true }))
    .catch(response => ({ error: response.message }))

// Generic 'update' function
export const firebaseUpdateData = (table, id, data) =>
  database
    .ref(table)
    .child(id)
    .update(data)
    .then(() => ({ success: true }))
    .catch(response => ({ error: response.message }))

// 'On' listener
export const addFirebaseListener = (table, id, callback) =>
  database
    .ref(table)
    .child(id)
    .on('value', snapshot => callback(snapshot.val()))

// 'Off' listener
export const removeFirebaseListener = (table, id) =>
  database.ref(table).child(id).off()

// ---------- AUTHENTICATION ----------

// Generic email and password sign in
export const firebaseSignIn = (email, password) =>
  auth
    .signInWithEmailAndPassword(email, password)
    .then(response => ({ success: true, id: response.uid, response }))
    .catch(response => ({ error: true, response }))

// Generic email and password sign up
export const firebaseSignUp = (email, password) =>
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(response => ({ success: true, id: response.uid }))
    .catch(response => ({ error: true, response }))

// Sign out
export const firebaseSignOut = () =>
  auth
    .signOut()
    .then(() => ({ success: true }))
    .catch(response => ({ error: response.message }))

// Provider sign in
export const firebaseProviderSignIn = providerName =>
  auth
    .signInWithPopup(providers[providerName])
    .then(response => ({ success: true, user: response.user }))
    .catch(response => ({ error: response.message }))

// ---------- PROFILE ----------
// TODO: check if needed
export const updateProfile = userProfile =>
  auth.currentUser
    .updateProfile({
      displayName: userProfile.displayName,
      photoURL: userProfile.photoURL
    })
    .then(
      () => {
        console.log('Success')
      },
      error => {
        console.log('Error', error)
      }
    )

// TODO: check if needed
export const updateEmail = email =>
  auth.currentUser.updateEmail(email).then(
    () => {
      console.log('Success')
    },
    error => {
      console.log('Error', error)
    }
  )

// ---------- USER DATA UPDATING ----------

// TODO: perhaps I should remove it and make a call directly in the Vuex module
export const updateUserData = user => {
  if (user.uid) return firebaseUpdateData('Users', user.uid, user)
}

// TODO: check if needed
export const updateAndReturnUserSettings = settings => {
  firebaseUpdateData('Users', auth.currentUser.uid, { settings })
  return settings
}
