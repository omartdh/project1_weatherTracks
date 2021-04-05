$(document).ready(function () {
  //builds out locally saved songs on opening the page
  buildSavedSongs();
  const apiKey = "1eab01d7108337f226a88f463c7de917";

  const mainQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=";

  let cityName = "";
  let temp = "";
  let songsArray = [];

  //this key word is to use for the song URL
  let wKeyWord = "";
  var APIKey = "4768c3baac58c09f5faba20fb58257a9";

  function inisialiser() {
    $('#city-name').empty();
    $('#temp').empty();
    $('#humidity').empty();
    $('#wind').empty();
    $('#icon').empty();
}

//function to pull tracks from LastFM and add them into an array for use on the site. collects title, artist, and url


  function trackNames(track) {
    let queryURL = "https://ws.audioscrobbler.com/2.0/?method=track.search&track=" + track + "&api_key=" + APIKey + "&format=json";
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      const tracks = response.results.trackmatches.track;
      songsArray.splice(0, songsArray.length);
      for (let i = 0; i < 10; i++) {
        songsArray.push(tracks[i].name);
        songsArray.push(tracks[i].artist);
        songsArray.push(tracks[i].url)
      }
      //builds song rows once the song information has been collected
      buildSongRows();
    })
  }
  //takes song information and builds it into songs on the page
  function buildSongRows() {
    $("#songsContainer").empty();
    let testArraySongs = [];
    let testArrayArtists = [];
    let testArrayUrls = [];
    for (let i = 0; i < songsArray.length; i += 3) {
      testArraySongs.push(songsArray[i]);
      testArrayArtists.push(songsArray[i + 1]);
      testArrayUrls.push(songsArray[i + 2]);
    }
    // function global counter to count through ten songs
    let songCounter = 0;
    // For loop to build two rows of songs
    for (let i = 0; i < 2; i++) {
      //Making new row 
      const songsRow = $("<div>");
      songsRow.addClass("row row-cols-auto");
      for (let i = 0; i < 5; i++) {
        // Creating Song Card for new song
        const songCol = $("<div>");
        songCol.addClass("col");
        const songCard = $("<div>");
        songCard.addClass("card-body");
        // getting and setting song title in card
        const songTitle = $("<h5>");
        songTitle.addClass("card-title");
        const songTLink = $("<a>");
        songTLink.text(testArraySongs[songCounter]);
        songTLink.attr("href", testArrayUrls[songCounter]);
        // getting and setting song artist with link
        const songArtist = $("<p>");
        songArtist.addClass("card-text");
        const songALink = $("<a>");
        songALink.text(testArrayArtists[songCounter]);
        songALink.attr("href", testArrayUrls[songCounter]);
        //creating Save button
        const saveButton = $("<button>");
        saveButton.addClass("btn btn-default saveBtn");
        saveButton.text("Save");
        //appending all items as needed
        songTitle.append(songTLink);
        songArtist.append(songALink);
        songCard.append(songTitle);
        songCard.append(songArtist);
        songCard.append(saveButton);
        songsRow.append(songCol);
        songsRow.append(songCard);
        songCounter++;
      }
      $("#songsContainer").append(songsRow);
    }

  }
  //clicke event that sstarts the city search and song search 
  $('#search-city').on('click', function (event) {
    event.preventDefault();
    cityName = $('#search-input').val();

    let QueryURL = mainQueryURL + cityName + "&appid=" + apiKey;

    //ajax query for the open weather
    $.ajax({
      url: QueryURL,
      method: "GET"
    }).then(function (response) {
      //code to interpret openweather info and push onto page
      temp = (response.main.temp * 9 / 5) - 459.67;
      let tempStr = temp.toString();
      tempStr = tempStr.substring(0, 2);

      let iconCode = response.weather[0].icon;
      let iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
      let iconLogo = $('<img>');
      iconLogo.attr("src", iconUrl);



      $('#city-name').append(iconLogo);
      $('#city-name').append($('<h4>').text(response.name));
      $('#temp').text("Temp: " + tempStr + " F");
      $('#humidity').text('Humidity: ' + response.main.humidity + " %");
      $('#wind').text('Wind Speed: ' + response.wind.speed + " MPH");
      //saves keyword for last FM search and then goes to tracknames function to perform search. 
      wKeyWord = response.weather[0].main;
      trackNames(wKeyWord);
    })

    inisialiser();

  })
})
