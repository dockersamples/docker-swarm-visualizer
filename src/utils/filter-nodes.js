let filterNodesTimeout;

function filterNodesTimeoutCallback() {
  let newHistory = encodeURI(document.querySelector('#filter-nodes').value);
  history.pushState({}, '', '?filterNodes=' + newHistory);
}

function filterNodesHistory() {
  if (typeof filterNodesTimeout !== 'undefined') {
    clearTimeout(filterNodesTimeout);
  }
  filterNodesTimeout = setTimeout(filterNodesTimeoutCallback, 500);
}

function filterNodesMap(element) {
  let component = element.split('=');
  this[component[0]] = component[1];
  return this;
}

export function filterNodes() {

  // Fetch DOM elements, break each word in input filter.
  let filterNodesValues = document.querySelector('#filter-nodes').value.trim().split(' ');
  let nodes = document.querySelectorAll('.node');

  // Iterate through each node.
  for (let i = 0; i < nodes.length; i++) {

    // Get node title.
    let spanText = nodes[i].querySelector('.labelarea').querySelector('span').innerHTML;

    // Define hidden by default.
    let hide = true;

    // Iterate through each word, show if any are found.
    for (let j = 0; j < filterNodesValues.length; j++) {
      if (spanText.indexOf(filterNodesValues[j]) >= 0) {
        hide = false;
        break;
      }
    }

    // Display or hide node, based on filter.
    if (hide) {
      nodes[i].classList.add('hide');
      nodes[i].classList.remove('show');
    }
    else {
      nodes[i].classList.remove('hide');
      nodes[i].classList.add('show');
    }
  }
  filterNodesHistory();
}

export function filterNodesOnLoad() {
  let filterNodesInput = document.querySelector('#filter-nodes');
  if (!filterNodesInput) {
    setTimeout(filterNodesOnLoad, 1000);
    return;
  }
  let search = decodeURIComponent(location.search);
  if (!search) {
    return;
  }

  let searchObj = search
    .substring(1)
    .split('&')
    .map(filterNodesMap, {})[0];

  if (searchObj.filterNodes) {
    filterNodesInput.value = searchObj.filterNodes;
    console.log('about to call filterNodes');
    console.log(typeof filterNodes);
    setTimeout(filterNodes, 2000);
  }
}
