function cloudList(cloud) {
    localStorage.setItem('cloud', cloud)

    document.querySelector('.title').innerHTML = cloud
    document.querySelector('.login-button').innerHTML = `Fazer login no ${cloud}`
}

// GOOGLE DRIVE ACESS

const CLIENT_ID = 'YOUR-CLIENT-ID'
const API_KEY = 'YOUR-API-KEY'

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]

// Authorization scopes required by the API.
// Multiple scopes can be included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly'

const authorizeButton = document.querySelector('.login-button')
const signoutButton = document.getElementById('signout_button')

// On load, called to load the auth2 library and API client library.
function handleClientLoad() {
  gapi.load('client:auth2', initClient)
}

// Initializes the API client library and sets up sign-in state listeners
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus)

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
    authorizeButton.onclick = handleAuthClick
    signoutButton.onclick = handleSignoutClick
  }, function(error) {
    appendPre(JSON.stringify(error, null, 2))
  });
}

// Called when the signed in status changes, to update the UI
// appropriately. After a sign-in, the API is called.
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none'
    listFiles();
  } else {
    authorizeButton.style.display = 'block'
  }
}

// Sign in the user upon button click
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

// Sign out the user upon button click
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

function appendPre(message) {
  let pre = document.getElementById('content')
  let textContent = document.createTextNode(message + '\n')
  pre.appendChild(textContent)
}

function createNodes(files) {
    document.querySelector('.contentCards').style.display = 'flex'

    const contentCards = document.querySelector('.contentCards')
    const card = document.querySelector('.card')

    files.map(file => {
        const cardClone = card.cloneNode(true)
        cardClone.querySelector('.name').innerHTML = file.name

        contentCards.appendChild(cardClone)
        console.log(file.name)
    })

    document.querySelector('.card').style.display = 'none'
}

// Print files
function listFiles() {
  gapi.client.drive.files.list({
    'pageSize': 10,
    'fields': "nextPageToken, files(id, name)"
  }).then(function(response) {
    let files = response.result.files
    if(files && files.length > 0) {
        createNodes(files)
    } else {
        appendPre('No files found')
    }
  })
}