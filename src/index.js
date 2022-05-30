import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;
const input = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function clearData() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function renderCountries(countries) {
  return countries.map(country => {
    return `
    <li> 
    <img src = "${country.flags.svg}" alt = Flag of "${country.name.official}}" class = "flag" ">
    <span class="title-country">${country.name.official}</span>
    </li>`;
  });
}

function renderCountry(country) {
  return `
    <div class="info-title">
    <img src = "${country.flags.svg}" alt = Flag of "${country.name.official}" class = "flag" ">
    <p><span class="info-title-data">Country: </span>${country.name.official}</p>
    <p><span class="info-title-data">Capital: </span>${country.capital}</p>
    <p><span class="info-title-data">Population: </span>${country.population}</p>
    <p><span class="info-title-data">language: </span>${Object.values(country.languages)}</p>
  </div>`;
}

function searchCountry(e) {
  const inputValue = e.target.value.trim();
  if (inputValue === '') {
    clearData();
    return;
  }
  fetchCountries(inputValue)
    .then(countries => {
      clearData();
      if (countries.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
      } else if (countries.length === 1) {
        countryInfo.insertAdjacentHTML('afterbegin', renderCountry(countries[0]));
      } else {
        const list = renderCountries(countries).join(' ');
        countryList.insertAdjacentHTML('afterbegin', list);
      }
    })
    .catch(error => {
      Notiflix.Notify.failure(error);
    });
}