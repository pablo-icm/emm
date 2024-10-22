// Active publication filters.
let pubFilters = {};

// Search term.
let searchRegex;

// Filter values (concatenated).
let filterValues;

// Publication container.
let $grid_pubs = $('#container-publications');

// Function to parse URL parameters
function getQueryParams() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const regex = /([^&=]+)=([^&]*)/g;
  let m;

  while (m = regex.exec(queryString)) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }

  return params;
}

// Initialise Isotope publication layout if required.
if ($grid_pubs.length) {
  $grid_pubs.isotope({
    itemSelector: '.isotope-item',
    percentPosition: true,
    masonry: {
      columnWidth: '.grid-sizer',
    },
    filter: function () {
      let $this = $(this);
      let searchResults = searchRegex ? $this.text().match(searchRegex) : true;
      let filterResults = filterValues ? $this.is(filterValues) : true;
      return searchResults && filterResults;
    },
  });

  // Filter by search term.
  let $quickSearch = $('.filter-search').keyup(
    debounce(function () {
      searchRegex = new RegExp($quickSearch.val(), 'gi');
      $grid_pubs.isotope();
    }),
  );

  $('.pub-filters').on('change', function () {
    let $this = $(this);

    // Get group key.
    let filterGroup = $this[0].getAttribute('data-filter-group');


    pubFilters[filterGroup] = this.value;

    // If the supervisor filter changes, ensure to filter by thesis
    if (filterGroup === 'supervisor') {
        pubFilters['pubtype'] = '.pubtype-thesis'; // restrict to thesis
    }
  
    // Combine filters.
    filterValues = concatValues(pubFilters);

    // Activate filters.
    $grid_pubs.isotope();

    // Update the URL hash to enable direct linking to results.
    if (filterGroup === 'pubtype' || filterGroup === 'author' || filterGroup === 'year' || filterGroup === 'supervisor') {
      let url = $(this).val();
      if (url.startsWith('.pubtype-') || url.startsWith('.author-') || url.startsWith('.year-') || url.startsWith('.supervisor-')) {
        window.location.hash = url.substr(url.indexOf('-') + 1);
      } else {
        window.location.hash = '';
      }
    }
  });

  // Check for initial URL parameters
  const queryParams = getQueryParams();
  if (queryParams.author) {
    const authorFilterValue = '.author-' + queryParams.author;
    pubFilters['author'] = authorFilterValue; // Set the author filter
    filterValues = concatValues(pubFilters); // Combine all filters
    $grid_pubs.isotope(); // Apply the filter
  }
  if (queryParams.supervisor) {
    const supervisorFilterValue = '.supervisor-' + queryParams.supervisor;
    pubFilters['supervisor'] = supervisorFilterValue; // Set the supervisor filter
    pubFilters['pubtype'] = '.pubtype-thesis'; // also restrict to thesis
    filterValues = concatValues(pubFilters); // Combine all filters
    $grid_pubs.isotope(); // Apply the filter
  }
  
  

  // Combine all filters
  filterValues = concatValues(pubFilters); 
  $grid_pubs.isotope(); // Apply the filter

  // Set the dropdown to the selected author and supervisor if they exist
  if (queryParams.author) {
    $('.pub-filters[data-filter-group="author"]').val(pubFilters['author']);
  }
  
  if (queryParams.supervisor) {
    $('.pub-filters[data-filter-group="supervisor"]').val(pubFilters['supervisor']);
  }
}

// Debounce input to prevent spamming filter requests.
function debounce(fn, threshold) {
  let timeout;
  threshold = threshold || 100;
  return function debounced() {
    clearTimeout(timeout);
    let args = arguments;
    let _this = this;

    function delayed() {
      fn.apply(_this, args);
    }

    timeout = setTimeout(delayed, threshold);
  };
}

// Flatten object by concatenating values.
function concatValues(obj) {
  let value = '';
  for (let prop in obj) {
    value += obj[prop];
  }
  return value;
}

// Filter publications according to hash in URL.
function filter_publications() {
  // Check for Isotope publication layout.
  if (!$grid_pubs.length) return;

  let urlHash = window.location.hash.replace('#', '');
  let filterValue = '*';

  // Check if hash is set.
  if (urlHash != '') {
    // Determine if filtering by pubtype or author based on URL hash prefix
    if (urlHash.startsWith('pubtype-')) {
      filterValue = '.pubtype-' + urlHash.replace('pubtype-', '');
    } else if (urlHash.startsWith('author-')) {
      filterValue = '.author-' + urlHash.replace('author-', '');
    } else if (urlHash.startsWith('supervisor-')) {
      filterValue = '.supervisor-' + urlHash.replace('supervisor-', '');
    }
  }

  // Set filter.
  let filterGroup = urlHash.startsWith('author-') ? 'author' : urlHash.startsWith('supervisor-') ? 'supervisor' : 'pubtype';
  pubFilters[filterGroup] = filterValue;
  filterValues = concatValues(pubFilters);

  // Activate filters.
  $grid_pubs.isotope();

  // Set selected option for either author or publication type.
  if (filterGroup === 'pubtype') {
    $('.pubtype-select').val(filterValue);
  } else if (filterGroup === 'author') {
    $('.pub-filters[data-filter-group="author"]').val(filterValue);
  } else if (filterGroup === 'supervisor') {
    $('.pub-filters[data-filter-group="supervisor"]').val(filterValue);
  }
}


document.addEventListener('DOMContentLoaded', function () {
  // Enable publication filter for publication index page.
  if ($('.pub-filters-select')) {
    filter_publications();
    // Useful for changing hash manually (e.g. in development):
    // window.addEventListener('hashchange', filter_publications, false);
  }

  // Load citation modal on 'Cite' click.
  $('.js-cite-modal').click(function (e) {
    e.preventDefault();
    let filename = $(this).attr('data-filename');
    let modal = $('#modal');
    modal.find('.modal-body code').load(filename, function (response, status, xhr) {
      if (status == 'error') {
        let msg = 'Error: ';
        $('#modal-error').html(msg + xhr.status + ' ' + xhr.statusText);
      } else {
        $('.js-download-cite').attr('href', filename);
      }
    });
    modal.modal('show');
  });

  // Copy citation text on 'Copy' click.
  $('.js-copy-cite').click(function (e) {
    e.preventDefault();
    // Get text to copy.
    let citation = document.querySelector('#modal .modal-body code').innerHTML;
    navigator.clipboard
      .writeText(citation)
      .then(function () {
        console.debug('Citation copied!');
      })
      .catch(function () {
        console.error('Citation copy failed!');
      });
  });
});
