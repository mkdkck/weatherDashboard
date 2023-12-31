let city = "";
let geocode = {
    lat: 0,
    lon: 0,
}
const history = $('#history');
// initialize the dialog, set it to not open status
$( "#correctCity" ).dialog({
    autoOpen: false
});

//eventlistener on the search bar
$('#searchBar').on('submit', function(event){
    event.preventDefault();
    city = $('#city').val().trim();
    if (city == ''){
        $( "#correctCity" ).dialog( "open" );
        return;
    } else {};
    getGeocode();
})

// Geocode API
function getGeocode(){
    const geocodeAPI = 'http://api.openweathermap.org/geo/1.0/direct?q='+city+'&limit=5&appid=53cd40b89c09fcb06493bd8c604c7714'
    fetch(geocodeAPI)
    .then(function(response){
        return response.json();
    })
    .then (function(data){
        geocode.lat = data[0].lat;
        geocode.lon = data[0].lon;
        console.log(data)
        console.log(geocode)

        //get city name value from the API, ensure the current expression of the desire searched city.
        city = data[0].name;
        searchHistory(city);
    })
}

//weather API
function getWeather(){
    const weatherAPI = `http://api.openweathermap.org/data/2.5/forecast?lat=${geocode.lat}&lon=${geocode.lon}&appid=53cd40b89c09fcb06493bd8c604c7714&units=metric`
    fetch(weatherAPI)
    .then(function(response){
        return response.json();
    })
    .then (function(data){
        console.log (data)
        showCurrent(data);
        show5Days(data); 
    })
}

function showCurrent(data) {
    // clear the div to prevent duplicate info created when submit multiple times.
    $('#weatherToday').empty();

    //added UVI info.
    console.log(geocode)

    const UVAPI = `https://api.openweathermap.org/data/3.0/onecall?lat=${geocode.lat}&lon=${geocode.lon}&appid=53cd40b89c09fcb06493bd8c604c7714`
    fetch(UVAPI)
    .then(function(UVresponse){
        return UVresponse.json();
    })
    .then (function(UVdata){
        console.log (UVdata,'UVdata')   
        const UVI= $('<p>');
        UVI.addClass('card-text');
        UVI.text(`Current UVI: ${UVdata.current.uvi}`);
        $('#weatherToday').append(UVI);
    })
    
    
    const todayCity = $('<h5>');
    todayCity.addClass('card-title fw-bolder fs-4');
    todayCity.text(city +"  " + data.list[0].dt_txt.slice(0, 10));


    const weatherIcon = 'https://openweathermap.org/img/wn/'+ data.list[0].weather[0].icon +'@2x.png'
    const cardText = $('<img>');
    cardText.attr({
        src: weatherIcon,
        alt: data.list[0].weather[0].description});
    cardText.addClass('icon card-text')

    const todayTemp = $('<p>');
    todayTemp.addClass('card-text');
    todayTemp.text('Current Temp : '+ data.list[0].main.temp.toFixed(1) + "°C");

    const todayWind = $('<p>');
    todayWind.addClass('card-text');
    const kmph = data.list[0].wind.speed*60*60/1000;
    todayWind.text('Current Windspeed : ' + kmph.toFixed(2) + "KMPH");

    const todayHumidity = $('<p>');
    todayHumidity.addClass('card-text');
    todayHumidity.text('Current Humidity : ' + data.list[0].main.humidity + "%");

    $('#weatherToday').append([todayCity,cardText,todayTemp,todayWind,todayHumidity]);
}

// same logic as current weather. by using for loop to autofill 5 days info.
function show5Days(data){
    for (i=1;i<6;i++){
        $('#day'+i).empty();
    
        const y=i*8-1
        const fiveDate = $('<h5>');
        fiveDate.addClass('card-title fw-bolder fs-5');
        fiveDate.text(data.list[y].dt_txt.slice(0, 10));
           
        const weatherIcon = 'https://openweathermap.org/img/wn/'+ data.list[y].weather[0].icon +'@2x.png'
        const cardText = $('<img>');
        cardText.attr({
            src: weatherIcon,
            alt: data.list[y].weather[0].description});
        cardText.addClass('icon card-text')
    
        const todayTemp = $('<p>');
        todayTemp.addClass('card-text');
        todayTemp.text('Temp : '+ data.list[y].main.temp.toFixed(1) + "°C");
    
        const todayWind = $('<p>');
        todayWind.addClass('card-text');
        const kmph = data.list[y].wind.speed*60*60/1000;
        todayWind.text('Windspeed : ' + kmph.toFixed(2) + " KMPH");
    
        const todayHumidity = $('<p>');
        todayHumidity.addClass('card-text');
        todayHumidity.text('Humidity : ' + data.list[y].main.humidity + "%");
        
        $('#day'+i).append([fiveDate,cardText,todayTemp,todayWind,todayHumidity]);
    }    
}

// passing city value from the Geocode API, allowing search history shows correct city name.
// this function achieves the generation of the button list for the search history.
function searchHistory(city){
    const historyBtn = $('<button>');
    historyBtn.attr({
        class: 'btn btn-secondary my-1',
        type: 'button',
        id: 'historyBtn'
    })

    historyBtn.text(city);
    history.append(historyBtn);

    //remove the first button when search record no reaches 5
    const historyBtns= $('#historyBtn')
    if (history.children().length > 5) {
        historyBtns.first().remove()
    }

    // to store the history list into the local storage.
    const historyList = [history.children().eq(0).text()];
    for (i=1;i<history.children().length;i++){
        historyList.push(history.children().eq(i).text())         
    }
    localStorage.setItem('historyList',JSON.stringify(historyList));
}

//render page function for showing the presistant data on the page when open.
function renderPage(){
    const historyList = JSON.parse(localStorage.getItem('historyList'));
    if (historyList == undefined) {
        return;
    }

    for (i=0; i<historyList.length;i++){
    const historyBtn = $('<button>');
    historyBtn.attr({
        class: 'btn btn-secondary my-1',
        type: 'button',
        id: 'historyBtn'
    })
        historyBtn.text(historyList[i]);
        history.append(historyBtn);
    }
}

//eventlistener listening to the click on history buttons, passing text of the button to initialize the search of that value.
$('#history').on('click', function(event){
    const historyCity= $(event.target)
    city = historyCity.text();
    getGeocode();
    getWeather();
});

renderPage();
