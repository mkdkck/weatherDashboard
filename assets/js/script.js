let city = "";
let geocode = {
    lat: 0,
    lon: 0,
}
$( "#correctCity" ).dialog({
    autoOpen: false
});

$('#searchBar').on('submit', function(event){
    event.preventDefault();
    city = $('#city').val().trim();
    if (city == ''){
        $( "#correctCity" ).dialog( "open" );
        return;
    } else {};    
    getGeocode();
    getWeather();
})

// Geocode API
function getGeocode(){
    let geocodeAPI = 'http://api.openweathermap.org/geo/1.0/direct?q='+city+'&limit=5&appid=53cd40b89c09fcb06493bd8c604c7714'
    fetch(geocodeAPI)
    .then(function(response){
        return response.json();
    })
    .then (function(data){
        geocode.lat = data[0].lat;
        geocode.lon = data[0].lon;
        city = data[0].name;
        console.log(data)
        console.log(city)

    })
}

//weather API
function getWeather(){
    let weatherAPI = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + geocode.lat +'&lon=' + geocode.lon +'&appid=53cd40b89c09fcb06493bd8c604c7714&units=metric'
    fetch(weatherAPI)
    .then(function(response){
        return response.json();
    })
    .then (function(data){
        showCurrent(data);
        show5Days(data); 
    })
}

function showCurrent(data) {
    console.log(data)
    // clear the div to prevent duplicate info created when submit multiple times.
    $('#weatherToday').empty();

    let todayCity = $('<h5>');
    todayCity.addClass('card-title fw-bolder fs-4');
    todayCity.text(city +"  " + data.list[0].dt_txt);

    let weatherIcon = 'https://openweathermap.org/img/wn/'+ data.list[0].weather[0].icon +'@2x.png'
    let cardText = $('<img>');
    cardText.attr({
        src: weatherIcon,
        alt: data.list[0].weather[0].description});
    cardText.addClass('icon card-text')

    let todayTemp = $('<p>');
    todayTemp.addClass('card-text');
    todayTemp.text('Current Temp : '+ data.list[0].main.temp.toFixed(1) + "°C");

    let todayWind = $('<p>');
    todayWind.addClass('card-text');
    let kmph = data.list[0].wind.speed*60*60/1000;
    todayWind.text('Current Windspeed : ' + kmph.toFixed(2) + "KMPH");

    let todayHumidity = $('<p>');
    todayHumidity.addClass('card-text');
    todayHumidity.text('Current Humidity : ' + data.list[0].main.humidity + "%");

    $('#weatherToday').append([todayCity,cardText,todayTemp,todayWind,todayHumidity]);
}

function show5Days(data){
    for (i=1;i<6;i++){
        $('#day'+i).empty();

        let fiveDate = $('<h5>');
        fiveDate.addClass('card-title fw-bolder fs-5');
        fiveDate.text(dayjs().add(i,'day').format('YYYY-MM-DD'));
    
        let y=i*8-1
        let weatherIcon = 'https://openweathermap.org/img/wn/'+ data.list[y].weather[0].icon +'@2x.png'
        let cardText = $('<img>');
        cardText.attr({
            src: weatherIcon,
            alt: data.list[y].weather[0].description});
        cardText.addClass('icon card-text')
    
        let todayTemp = $('<p>');
        todayTemp.addClass('card-text');
        todayTemp.text('Temp : '+ data.list[y].main.temp.toFixed(1) + "°C");
    
        let todayWind = $('<p>');
        todayWind.addClass('card-text');
        let kmph = data.list[y].wind.speed*60*60/1000;
        todayWind.text('Windspeed : ' + kmph.toFixed(2) + " KMPH");
    
        let todayHumidity = $('<p>');
        todayHumidity.addClass('card-text');
        todayHumidity.text('Humidity : ' + data.list[y].main.humidity + "%");
        
        $('#day'+i).append([fiveDate,cardText,todayTemp,todayWind,todayHumidity]);
    }    
}


