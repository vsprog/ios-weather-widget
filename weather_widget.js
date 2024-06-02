/******************************************************************************
 * Info
 *****************************************************************************/

// This script displays the current weather conditions from openweathermap.org
//
// THIS SCRIPT IS DESIGNED TO RUN AS A SMALL WIDGET
// 
// Check the configuration below to modify appearance & functionality


/******************************************************************************
 /* Constants and Configurations
 /* DON'T SKIP THESE!!!
 *****************************************************************************/

// Your openweathermap token
const API_TOKEN= 'YOUR_OPENWEATHERMAP_API_KEY';

const conditions = {
    200: { description: 'thunder&rain', icon: '10' },
    201: { description: 'thunder&rain', icon: '10' },
    202: { description: 'thunder&rain', icon: '10' },
    210: { description: 'thunderstorm', icon: '11' },
    211: { description: 'thunderstorm', icon: '11' },
    212: { description: 'thunderstorm', icon: '11' },
    221: { description: 'thunderstorm', icon: '11' },
    230: { description: 'thunder&rain', icon: '10' },
    231: { description: 'thunder&rain', icon: '10' },
    232: { description: 'thunder&rain', icon: '10' },
    300: { description: 'light drizzle', icon: '04' },
    301: { description: 'drizzle', icon: '04' },
    302: { description: 'heavy drizzle', icon: '04' },
    310: { description: 'drizzle rain', icon: '04' },
    311: { description: 'drizzle rain', icon: '04' },
    312: { description: 'drizzle rain', icon: '09' },
    313: { description: 'showerdrizzle', icon: '09' },
    314: { description: 'showerdrizzle', icon: '09' },
    321: { description: 'showerdrizzle', icon: '09' },
    500: { description: 'light rain', icon: '04' },
    501: { description: 'moderate rain', icon: '04' },
    502: { description: 'heavy rain', icon: '09' },
    503: { description: 'heavy rain', icon: '09' },
    504: { description: 'extreme rain', icon: '09' },
    511: { description: 'freezing rain', icon: '09' },
    520: { description: 'shower rain', icon: '09' },
    521: { description: 'shower rain', icon: '09' },
    522: { description: 'shower rain', icon: '09' },
    531: { description: 'ragged rain', icon: '09' },
    600: { description: 'light snow', icon: '05' },
    601: { description: 'snow', icon: '05' },
    602: { description: 'heavy snow', icon: '12' },
    611: { description: 'sleet', icon: '14' },
    612: { description: 'shower sleet', icon: '14' },
    613: { description: 'shower sleet', icon: '14' },
    615: { description: 'rain & snow', icon: '14' },
    616: { description: 'rain & snow', icon: '14' },
    620: { description: 'shower snow', icon: '12' },
    621: { description: 'shower snow', icon: '12' },
    622: { description: 'shower snow', icon: '12' },
    701: { description: 'mist', icon: '06' },
    711: { description: 'smoke', icon: '06' },
    721: { description: 'haze', icon: '06' },
    731: { description: 'dust whirls', icon: '06' },
    741: { description: 'fog', icon: '06' },
    751: { description: 'sand', icon: '06' },
    761: { description: 'dust', icon: '06' },
    762: { description: 'volcanic ash', icon: '06' },
    771: { description: 'squalls', icon: '13' },
    781: { description: 'tornado', icon: '13' },
    800: { description: 'clear sky', icon: '01' },
    801: { description: 'few clouds', icon: '02' },
    802: { description: 'scattered', icon: '03' },
    803: { description: 'broken clouds', icon: '07' },
    804: { description: 'overcast', icon: '08' },
};

/******************************************************************************
 * Setup
 *****************************************************************************/

const weatherData = await fetchWeatherData();
const widget = await createWidget();

Script.setWidget(widget);
Script.complete()

async function createWidget() {
    const widget = new ListWidget();

    const gradient = new LinearGradient();
    gradient.locations = [0, 1];
    gradient.colors = [
        new Color('171a21'),
        new Color('1b2838')
    ];
    widget.backgroundGradient = gradient;

    widget.setPadding(0, 0, 0, 0);

    let nextRefresh = Date.now() + 1000 * 60 * 15; // each 15 minutes
    widget.refreshAfterDate = new Date(nextRefresh);
    
    await renderContentStack(widget);
    
    return widget
}

async function renderContentStack(widget) {
    const contentStack = widget.addStack();
    contentStack.layoutVertically();
    contentStack.setPadding(14, 10, 10, 10);

    renderConditionsStack(contentStack);
    await renderTemperatureStack(contentStack);
    await renderPressureStack(contentStack);
    await renderWindStack(contentStack);
    await renderDuskDawnStack(contentStack);
}

function renderConditionsStack(contentStack) {
    const conditionsStack = contentStack.addStack();
    conditionsStack.layoutVertically();
    conditionsStack.centerAlignContent();
    conditionsStack.setPadding(0, 0, 6, 0);
    
    const { description } = parseWeatherData();
    const conditionField = conditionsStack.addText(description);
    conditionField.font = new Font('ModernDotDigital-7', 17);
    conditionField.textColor = new Color('fff');
}

async function renderTemperatureStack(contentStack) {
    const tempStack = contentStack.addStack();
    tempStack.layoutHorizontally();
    tempStack.bottomAlignContent();
    tempStack.spacing = 10;
    tempStack.setPadding(0, 0, 6, 0);

    const { icon, temperature, isAfternoon } = parseWeatherData();
    const letter = isAfternoon ? 'd' : 'n';
    const imageData = await downloadImage(`https://raw.githubusercontent.com/vsprog/ios-weather-widget/master/icons/${icon}${letter}.png`);
    let image = tempStack.addImage(imageData);
    image.imageSize = new Size(24, 24);

    const currentTemp = tempStack.addText(temperature);
    currentTemp.font = new Font('ModernDotDigital-7', 18);
    currentTemp.leftAlignText();
    currentTemp.textColor = new Color('fff');

    tempStack.addSpacer();
}

async function renderPressureStack(contentStack){
    const presStack = contentStack.addStack();
    presStack.layoutHorizontally();
    presStack.bottomAlignContent();
    presStack.spacing = 10;
    presStack.setPadding(0, 0, 6, 0);

    const imageData = await downloadImage('https://raw.githubusercontent.com/vsprog/ios-weather-widget/master/icons/pr.png');
    let image = presStack.addImage(imageData);
    image.imageSize = new Size(20, 20);
    
    const { pressure } = parseWeatherData();

    const pressureField = presStack.addText(pressure);
    pressureField.font = new Font('ModernDotDigital-7', 16);
    pressureField.leftAlignText();
    pressureField.textColor = new Color('fff');

    presStack.addSpacer();
}

async function renderWindStack(contentStack){
    const windStack = contentStack.addStack();
    windStack.layoutHorizontally();
    windStack.bottomAlignContent();
    windStack.spacing = 8;
    windStack.setPadding(0, 0, 6, 0);

    const imageData = await downloadImage('https://raw.githubusercontent.com/vsprog/ios-weather-widget/master/icons/wg.png');
    let image = windStack.addImage(imageData);
    image.imageSize = new Size(20, 20);

    const { speed, dir } = parseWeatherData().wind;

    const speedField = windStack.addText(speed);
    speedField.font = new Font('ModernDotDigital-7', 14);
    speedField.leftAlignText();
    speedField.textColor = new Color('fff');

    const dirImageData = await downloadImage(`https://raw.githubusercontent.com/vsprog/ios-weather-widget/master/icons/${dir}.png`);
    let dirImage = windStack.addImage(dirImageData);
    dirImage.imageSize = new Size(20, 20);
    
}

async function renderDuskDawnStack(contentStack){
    const duskDawnStack = contentStack.addStack();
    duskDawnStack.layoutHorizontally();
    duskDawnStack.bottomAlignContent();
    duskDawnStack.spacing = 8;

    const { dusk, dawn } = parseWeatherData();

    const duskImageData = await downloadImage('https://raw.githubusercontent.com/vsprog/ios-weather-widget/master/icons/sr.png');
    let duskImage = duskDawnStack.addImage(duskImageData);
    duskImage.imageSize = new Size(20, 20);

    const duskField = duskDawnStack.addText(dusk);
    duskField.font = new Font('ModernDotDigital-7', 14);
    duskField.leftAlignText();
    duskField.textColor = new Color('fff');

    const dawnImageData = await downloadImage('https://raw.githubusercontent.com/vsprog/ios-weather-widget/master/icons/ss.png');
    let dawnImage = duskDawnStack.addImage(dawnImageData);
    dawnImage.imageSize = new Size(20, 20);

    const dawnField = duskDawnStack.addText(dawn);
    dawnField.font = new Font('ModernDotDigital-7', 14);
    dawnField.leftAlignText();
    dawnField.textColor = new Color('fff');
}

function parseWeatherData() {
    const currentCondition = conditions[weatherData.weather[0].id];
    const now = Date.now();
    const sunriseMs = weatherData.sys.sunrise*1000;
    const sunsetMs = weatherData.sys.sunset*1000;
        
    return {
        icon: currentCondition.icon,
        description: currentCondition.description.toUpperCase(),
        temperature: `${Math.ceil(weatherData.main.temp)}°`,
        pressure: `${weatherData.main.pressure} hPa`,
        isAfternoon:  now > sunriseMs && now < sunsetMs,
        dusk: getStringTime(sunriseMs),
        dawn: getStringTime(sunsetMs),
        wind: {
            speed: `${weatherData.wind.speed} km/h`,
            dir: getDirection(weatherData.wind.deg)
        }
    };
}

function getDirection(azimuth) {
    let direction;
    
    switch(true) {
        case azimuth === 0: 
            direction = 'n';
            break;
        case azimuth > 0 && azimuth < 90:
            direction = 'ne';
            break;
        case azimuth === 90:
            direction = 'e';
            break;
        case azimuth > 90 && azimuth < 180:
            direction = 'se';
            break;
        case azimuth === 180:
            direction = 's';
            break;
        case azimuth > 180 && azimuth < 270:
            direction = 'sw';
            break;
        case azimuth === 270:
            direction = 'w';
            break;
        case azimuth > 270 && azimuth < 360:
            direction = 'nw';
            break;
    }
    
    return direction;
}

function getStringTime(ms) {
    const date = new Date(ms);
    return `${date.getHours()}:${date.getMinutes()}`;
}

async function fetchWeatherData(){
    let {latitude, longitude} = await Location.current();
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=${API_TOKEN}`;
    const req = new Request(url);
    
    return await req.loadJSON();
}

async function downloadImage(url){
    const iconRequest = await new Request(url);
    
    return await iconRequest.loadImage();
}