console.log('Client side js is loaded')

const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')
const messageThree = document.querySelector('#message-3')
const img = document.querySelector("#webcam")

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

