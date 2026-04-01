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

// //Задача #3 и #4
// async function handleSearchTasks() {
//     try {
//         const token = store.getToken(); // получаем токен из store
//         const response = await fetch(`http://localhost:8000/tasks?title=${localStorage.getItem('searchTitle') || ''}&status=${localStorage.getItem('filterStatus') || 'all'}`, {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         });

//         if (!response.ok) {
//             throw new Error('Не удалось получить задачи');
//         }

//         const data = await response.json();

        
//         localStorage.setItem('tasks', JSON.stringify(data.items));
//         store.setTasks(data.items); 

//         const analyticsData = {
//             action: 'search',
//             searchTitle: localStorage.getItem('searchTitle') || '',
//             filterStatus: localStorage.getItem('filterStatus') || 'all'
//         };

//         const blob = new Blob([JSON.stringify(analyticsData)], { type: 'application/json' });
//         navigator.sendBeacon('http://localhost:8000/analytics', blob);

//     } catch (err) {
//         console.error(err);
//         alert('Ошибка при получении задач или отправке аналитики');
//     }
// }

// Задача #5
async function handleLogout () {
    const token = store.getToken(); 
   const responce = await fetch('http://localhost:8000/logout', {
    method:'POST',
    headers: {
        'Authorization': `Bearer ${token}`
    }
   })
   if (responce.ok){
    localStorage.removeItem('accessToken')
    localStorage.removeItem('tasks')
    localStorage.removeItem('searchTitle')
    localStorage.removeItem('filterStatus') 
    store.reset()
    view.updateAppContent()
    } else {    
    throw new Error('Не удалось выйти из аккаунта')
   }
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
