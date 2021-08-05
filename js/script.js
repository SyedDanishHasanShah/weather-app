const API_KEY = '2ebaba7212ffeee43faad50a9c0b575d';
const cityInput = document.querySelector('#city');
const cityLabel = document.querySelector('.city-submission label');
const submitButton = document.querySelector('.submit-button');
const loader = document.querySelector('.loader');
const canvas = document.querySelector('#myChart').getContext('2d');
let chart = new Chart();

cityInput.addEventListener('keyup', function() {
    if (cityInput.value !== '') {
        cityLabel.style.opacity = 1;
    }
    if (cityInput.value === '') {
        cityLabel.style.opacity = 0;
    }
})

submitButton.addEventListener('click', async function() {
    if (document.querySelector('.error-message') != null) {
        const errors = document.querySelectorAll('.error-message');
        for (let i = 0; i < errors.length; i++) {
            errors[i].parentNode.removeChild(errors[i]);
        }
    }
    chart.destroy();
    try {
        const city = cityInput.value;
        loader.classList.remove('hidden');
        const jsonData = await getWeatherData(city);
        console.log(jsonData);
        const temperatureForFiveDays = [];
        const labelsForFiveDays = [];
        for (let i = 0; i < jsonData.list.length; i += 8) {
            temperatureForFiveDays.push(jsonData.list[i].main.temp);
            labelsForFiveDays.push(jsonData.list[i].dt_txt);
        }
        console.log(labelsForFiveDays);
        console.log(temperatureForFiveDays);
        chart = new Chart(canvas, {
                type: 'bar',
                maxBarThickness: 2,
                data: {
                        labels: labelsForFiveDays,
                        datasets: [{
                            label: 'Temperature in C',
                            data: temperatureForFiveDays,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                            ],
                            
                        }]
                },
        });
        loader.classList.add('hidden');
    }
    catch(err) {
        console.log(err.message);
    }
    finally {
        loader.classList.add('hidden');
    }
});

async function getWeatherData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            throw new Error('Request could not be fulfilled. Please check if you have entered the city name correctly and try again!');
        }
        return response.json();
    }
    catch(err) {
        renderError(err.message);
    }   
}


function renderError(message) {
    const header = document.querySelector('.header');
    const errorParagraph = document.createElement('p');
    errorParagraph.classList.add('error-message');
    errorParagraph.innerHTML = message;
    header.appendChild(errorParagraph);
}



