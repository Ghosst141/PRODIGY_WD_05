const searchbtn = document.querySelector('.city-search');
const locationbtn=document.querySelector('.current-location')
const cityinput = document.querySelector('.city-input');
const weathercards = document.querySelector('.weather-cards');
const currentweather = document.querySelector('.current-weather');
const API = "a7c2d60ba900abdb1806c8cab9a2ef60";

searchbtn.addEventListener('click', getlocation);
cityinput.addEventListener('keyup', (e)=>{
    if(e.key==='Enter'){
        getlocation();
    }
});
locationbtn.addEventListener('click', userlocation);



function getlocation() {
    const city = cityinput.value.trim();
    // console.log(city);
    if (!city) return;
    let url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API}`
    fetch(url).then((res) => {
        return res.json();
    }).then((res) => {
        if (!res.length) {
            return alert(`No coordinates found for ${city}`)
        }
        const { name, lat, lon } = res[0];
        getforecast(name, lat, lon);
    }).catch(error => {
        alert("An error ocuured while fetching your cordinates");
    })
}

function getforecast(name, lat, lon) {
    const cnt = 5;
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API}`;
    fetch(url).then((res) => {
        return res.json();
    }).then((res) => {
        const unique = [];
        const fiveday = res.list.filter((val) => {
            const date = new Date(val.dt_txt).getDate();
            if (!unique.includes(date)) {
                return unique.push(date);
            }
        })
        console.log(fiveday);
        weathercards.innerHTML = "";
        currentweather.innerHTML = "";
        fiveday.forEach((val, i) => {
            if (i !== 0) {
                weathercards.insertAdjacentHTML('beforeend', showcards(val));
            }
            else {
                currentweather.insertAdjacentHTML('beforeend', showcurrent(val, name));
            }
        })
    }).catch(error => {
        alert("An error ocuured while fetching your cordinates");
    })
}

function showcards(fiveday) {
    return `<li class="cards">
                <h3>${fiveday.dt_txt.split(" ")[0]}</h3>
                <img src="https://openweathermap.org/img/wn/${fiveday.weather[0].icon}@4x.png" alt="">
                <h3>${fiveday.weather[0].description}</h3>
                <h4>Temp: ${(fiveday.main.temp - 273.15).toFixed(2)}°C / ${(fiveday.main.temp).toFixed(2)}°F</h4>
                <h4>Min/Max: ${(fiveday.main.temp_min - 273.15).toFixed(2)}°C / ${(fiveday.main.temp_max - 273.15).toFixed(2)}°C</h4>
                <h4>Wind: ${fiveday.wind.speed} m/s</h4>
                <h4>Humidity: ${fiveday.main.humidity}%</h4>
            </li>`
}

function showcurrent(fiveday, city) {
    return `<div class="details">
                <h2>${city} ( ${fiveday.dt_txt.split(" ")[0]} )</h2>
                <h4><i class='bx bxs-thermometer'></i>Temp: ${(fiveday.main.temp - 273.15).toFixed(2)}°C / ${(fiveday.main.temp).toFixed(2)}°F</h4>
                <h4><i class='bx bx-wind' ></i>Wind: ${fiveday.wind.speed} m/s</h4>
                <h4><i class='bx bxs-droplet' ></i>Humidity: ${fiveday.main.humidity}%</h4>
                <h4><i class='bx bx-chevrons-down'></i>Pressure: ${fiveday.main.pressure} mb</h4>
            </div>
            <div class="icon">
                <img src="https://openweathermap.org/img/wn/${fiveday.weather[0].icon}@4x.png" alt="">
                <h4>${fiveday.weather[0].description}</h4>
                <h5>${(fiveday.main.temp_min - 273.15).toFixed(2)}°C / ${(fiveday.main.temp_max - 273.15).toFixed(2)}°C</h5>
                <h5>${(fiveday.main.temp_min).toFixed(2)}°F / ${(fiveday.main.temp_max).toFixed(2)}°F</h5>
            </div>`
}

function userlocation() {
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const { latitude, longitude } = pos.coords;
            console.log(pos.coords);
            const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API}`
            fetch(url).then((res) => {
                return res.json();
            }).then((res) => {
                if (!res.length) {
                    return alert(`No coordinates found for ${city}`)
                }
                const { name,lat,lon } = res[0];
                getforecast(name, lat, lon);
                console.log(res);
            }).catch(error => {
                alert("An error ocuured while fetching your cordinates");
            })
        }
    );
}


