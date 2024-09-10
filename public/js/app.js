console.log('Client side js is loaded')

const weatherForm = document.querySelector('form')
const search = document.querySelector('#autocomplete')
const autocompleteContainer = document.querySelector('.autocomplete-container')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')
const messageThree = document.querySelector('#message-3')
const img = document.querySelector("#webcam")
const suggestions = document.querySelector('#suggestions')

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const location = search.value

    messageOne.textContent = 'Loading Forecast'
    messageTwo.textContent = ''
    messageThree.textContent = ''
    img.src = ''

    fetch('/weather?address=' + location).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                messageOne.textContent = data.error
            } else {
                messageOne.textContent =  data.location
                messageTwo.textContent = data.temp + '°C. ' + data.description  
                if (data.retUrl) {
                    messageThree.textContent = 'Webcam: ' + data.title
                    img.src = data.retUrl
                } else {
                    messageThree.textContent = 'No webcam available. Try refining your search area, or searching in a more populated area.'
                    img.src = "../img/logo.png"
                    img.width = "200"
                    img.height = "200"
                }
            }        
        })
    })

})

search.addEventListener('input', async () => {
    const query = search.value;
    let abortController = null;

    if (query.length < 2) {
        suggestions.innerHTML = ''
        return;
    }

    if (abortController) {
        abortController.abort();
    }

    abortController = new AbortController();
    const signal = abortController.signal;

    try {
        const response = await fetch(`/locationSuggestions?location=${query}`, { signal });
        const results = await response.json()

        suggestions.innerHTML = '';

        results.forEach(result => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.textContent = result;
            div.addEventListener('click', () => {
                search.value = result;
                suggestions.innerHTML = '';
            });
            suggestions.appendChild(div);    
        })
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Request was aborted');
        } else {
            console.error('Error fetching suggestions:', error);
        }
    }
})

autocompleteContainer.addEventListener('blur', () => {
    suggestions.innerHTML = '';
})