/* Module for Address Book application */
var AddressBook = (function () {
  /*--------------------*/

  n = new Date();
  y = n.getFullYear();
  m = n.getMonth() + 1;
  d = n.getDate();

  /* ----------add members here -----------*/

  var contact = {
    name: ko.observable(),
    phoneNumber: ko.observable(),
    date: ko.observable(d + "/" + m + "/" + y),
  };

  (visi = ko.observable(null)), (contacts = ko.observableArray());

  total = ko.observable(null);

  /*-------------jquery---------------------*/

  /*----------helper fuction---------*/

  var addContact = function () {
    console.log("Adding new contact with name: " + contact.name() + " and phonenumber: " + contact.phoneNumber());
    console.log("addContactCalled");

    if (contact.name() && contact.phoneNumber()) {
      var paylaod = { name: contact.name(), phoneNumber: contact.phoneNumber(), date: contact.date() };
      contacts.push(paylaod);
      total(total() + 1);
      setLocalstorage(paylaod);
      clearContact();
      visi(false);
    } else {
      console.log("error report");

      visi(true);
    }
  };

  var setLocalstorage = function (payload) {
    console.log("json added");
    let data;

    if (localStorage.getItem("data") == null) {
      data = [];
    } else {
      data = JSON.parse(localStorage.getItem("data"));
    }

    data.push(payload);

    localStorage.setItem("data", JSON.stringify(data));
  };
  var state = {
    queryset: "",

    page: 1,

    rows: 5,
  };

  var getLocal = function () {
    let data;

    if (localStorage.getItem("data") === null) {
      data = [];
    } else {
      data = JSON.parse(localStorage.getItem("data"));
    }
    total(data.length);
    return data;
  };
  var getCurrentState = function () {
    console.log("curent state run");

    state.queryset = getLocal();

    var trimdata = pagination(state.queryset, state.page, state.rows);

    console.log("trimdata", trimdata);

    for (let i = 0; i < trimdata.queryset.length; i++) {
      contacts.push(trimdata.queryset[i]);
    }

    pageButton(trimdata.pages);
    // total(data.length);
  };

  var pageButton = function (pages) {
    console.log("pages", pages);
    var tpagination = document.getElementById("tpagination");

    console.log(tpagination);

    tpagination.innerHTML = "";

    for (let page = 1; page <= pages; page++) {
      tpagination.innerHTML += `<button value=${page} class="page ui blue basic button">${page}</button>`;
    }

    $(".page").on("click", function () {
      console.log("onClick worked");
      $("#tbody").empty();

      // state.page = $(this).val();
      console.log("state.page", state.page);

      var trimdata = pagination(state.queryset, $(this).val(), state.rows);
      console.log("jqury", trimdata.queryset);
      for (let i = 0; i < trimdata.queryset.length; i++) {
        contacts.push(trimdata.queryset[i]);
      }
    });
  };

  var pagination = function (queryset, page, rows) {
    console.log("pagination");
    var trimStart = (page - 1) * rows;
    var trimEnd = trimStart + rows;

    var trimData = queryset.slice(trimStart, trimEnd);

    var pages = Math.ceil(queryset.length / rows);

    return {
      queryset: trimData,

      pages: pages,
    };
  };

  var clearTable = function () {
    console.log("table cleared");
    localStorage.clear();

    window.location.reload();
  };

  var clearContact = function () {
    contact.name(null);
    contact.phoneNumber(null);

    console.log("clearContact");
  };

  /*--------------Initialization of DOM[On every DOM Update]------------------------*/

  var init = function () {
    /*------------add code to initialize this module------------*/

    console.log("first console");
    getCurrentState();
    visi(false);
    ko.applyBindings(AddressBook);
  };

  /*--------------------------------------*/

  $(init);
  return {
    /* ----------add members that will be exposed publicly---- */

    contact: contact,
    contacts: contacts,
    addContact: addContact,
    clearTable: clearTable,
  };
})();
