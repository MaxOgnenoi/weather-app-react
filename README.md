# Weather App

A simple weather app built using React that allows users to search for the weather in different locations. This app uses the OpenWeatherMap API to fetch weather data.

## Table of Contents
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Key Setup](#api-key-setup)

## Getting Started

This section will guide you through setting up and running the Weather App on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) - The JavaScript runtime used to build and run the app.

### Installation

1. Clone the repository to your local machine:

2. Navigate to the project directory:

3. Install the required dependencies using npm or yarn:

### Usage

1. To start the Weather App, run the following command:

2. Open your web browser and access the app at `http://localhost:3000`.

3. Enter a city name in the search input and click the search icon to fetch the weather information for that city.

4. The app will display the temperature, location, humidity, wind speed, and an appropriate weather icon.

### API Key Setup

To use this Weather App, you'll need to obtain an API key from the OpenWeatherMap website. Follow these steps to set up your API key:

1. Go to [OpenWeatherMap](https://openweathermap.org/) and create an account if you don't have one.

2. Once logged in, go to the "API Keys" section and create a new API key. Make sure it has access to the necessary weather data.

3. Create an `.env` file in the root directory of the Weather App if it doesn't already exist.

4. Inside the `.env` file, add your API key like this:


Replace `your-api-key-here` with the API key you obtained from OpenWeatherMap.

Now, your Weather App is ready to use with your API key.

---

