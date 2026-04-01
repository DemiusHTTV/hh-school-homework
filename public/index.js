import * as store from './storage.js'
import * as view from './view.js';


// Задача #1
async function handleLogin () {
    const login = await fetch('http://localhost:5000/login', {
        method: 'POST',
          headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        username: 'admin',
        password: '123'
    })
    })
    if (!login.ok) {
        throw new Error('Не удалось авторизоваться')
    }
    const data = await login.json()

    if(data.accessToken) {
        store.setToken(data.accessToken)
    }
}

// Задача #2
async function handleInputChange({ target: { value }}) {
    console.log(`searchTitle changed to "${value}"`)
    localStorage.setItem('searchTitle', value)
}

// Задача #2
async function handleSelectChange({ target: { value }}) {
    console.log(`filterStatus changed to "${value}"`)
    localStorage.setItem('filterStatus', value)
}

// Задача #3 и #4
async function handleSearchTasks() {
    console.log('search')
}

// Задача #5
async function handleLogout () {
    console.log('logout')
}

// Код ниже редактировать не нужно
async function handleSearch() {
    await handleSearchTasks()
    view.updateAppContent()
}

async function handleAuthorization () {
    try {
        if (store.isAuthorized()) {
            await handleLogout()
            store.reset()
        } else {
            await handleLogin()
            store.setSearchTitle('')
            store.setFilterStatus('')
            view.updateSearchInput('')
            view.updateFilterStatus('')
            await handleSearchTasks()
        }
        view.updateAppContent()
    } catch (e) {
        alert('Не удалось. Попробуйте еще раз!')
    }
}

handleSearchTasks().then(() => {
    view.updateAppContent()
    view.updateSearchInput(localStorage.getItem('searchTitle') || '')
    view.updateFilterStatus(localStorage.getItem('filterStatus') || '')
})

const searchInputElement = document.getElementById('searchInput')
const filterSelectElement = document.getElementById('filterStatus')
const authButtonElement = document.getElementById('authButton')
const searchButtonElement = document.getElementById('searchButton')

searchInputElement.addEventListener('keyup', handleInputChange)
filterSelectElement.addEventListener('change', handleSelectChange)
authButtonElement.addEventListener('click', handleAuthorization)
searchButtonElement.addEventListener('click', handleSearch)
