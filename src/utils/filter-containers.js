let filterTimeout;

function filterTimeoutCallback() {
  let newHistory = encodeURI(document.querySelector('#filter').value);
  history.pushState({}, '', '?filter=' + newHistory);
}

function filterHistory() {
  if (typeof filterTimeout !== 'undefined') {
    clearTimeout(filterTimeout);
  }
  filterTimeout = setTimeout(filterTimeoutCallback, 500);
}

function filterMap(element) {
  let component = element.split('=');
  this[component[0]] = component[1];
  return this;
}

export function filterContainers() {

  // Fetch DOM elements, break each word in input filter.
  let filterValues = document.querySelector('#filter').value.trim().split(' ');
  let containers = document.querySelectorAll('.container');

  // Iterate through each container.
  for (let i = 0; i < containers.length; i++) {

    // Get container title.
    let spanText = containers[i].querySelector('span').innerHTML;

    // Define hidden by default.
    let hide = true;

    // Iterate through each word, show if any are found.
    for (let j = 0; j < filterValues.length; j++) {
      if (spanText.indexOf(filterValues[j]) >= 0) {
        hide = false;
        break;
      }
    }

    // Display or hide container, based on filter.
    if (hide) {
      containers[i].classList.add('hide');
      containers[i].classList.remove('show');
    }
    else {
      containers[i].classList.remove('hide');
      containers[i].classList.add('show');
    }
  }
  filterHistory();
}

export function filterOnLoad() {
  let filterInput = document.querySelector('#filter');
  if (!filterInput) {
    setTimeout(filterOnLoad, 1000);
    return;
  }
  let search = decodeURIComponent(location.search);
  if (!search) {
    return;
  }

  let searchObj = search
    .substring(1)
    .split('&')
    .map(filterMap, {})[0];

  if (searchObj.filter) {
    filterInput.value = searchObj.filter;
    console.log('about to call filterContainers');
    console.log(typeof filterContainers);
    setTimeout(filterContainers, 2000);
  }
}
