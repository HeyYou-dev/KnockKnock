/* Module for Address Book application */
var AddressBook = (function () {
  /*-------unorganized-------------*/
  let d = new Date();
  // console.log(d.getTime());
  localTime = d.getTime();
  localOffset = d.getTimezoneOffset() * 60000;

  utc = localTime + localOffset;
  // console.log("utc", utc);

  Germaany = utc + 3600000 * 1;
  nd = new Date(Germaany);

  /*-------knockout validation configuration--------*/
  ko.validation.init({ insertMessages: false });
  /* ----------add members here -----------*/

  var contact = {
    Ticket_no: ko.observable().extend({
      minLength: 10,
      maxLength: 10,
      pattern: {
        message: "Hey this doesnt match ticket id pattern",
        params: "^[0-9]+$",
      },
    }),
    Quote_id: ko.observable().extend({
      minLength: 12,
      maxLength: 12,
      pattern: {
        message: "Hey this doesnt match quote id pattern",
        params: "^[0-9]+$",
      },
    }),
    ManualDate: ko.observable(false),

    Reason: ko.observable("BUG"),
    Change: ko.observable().extend({
      Required: true,
    }),
  };

  contact.ManualDate.subscribe(function (newValue) {
    if (!newValue) {
      contact.date(nd.toLocaleString());
    }
  }),
    (contact.date = ko.observable(contact.ManualDate() ? "" : nd.toLocaleString()));

  contact.isFormValid = ko.computed(function () {
    return this.Ticket_no() && this.Quote_id() && this.Reason() && this.Change();
  }, contact);

  contacts = ko.observableArray();

  total = ko.observable(null);

  /*--------------Search bar operation----------------*/

  var search = {
    inputBar: ko.observable("").extend({
      minLength: 10,
      maxLength: 12,
      pattern: {
        message: "Hey this doesnt match quote id pattern",
        params: "^[0-9]+$",
      },
    }),
  };

  search.isValid = function () {
    let a = search.inputBar();
    console.log(a.length);

    return a.length == 12 || a.length == 10;
  };

  /*-------------jquery---------------------*/

  $("#search").keyup(function () {
    if (!this.value) {
      console.log("jquery");
      contacts.removeAll();
      getCurrentState();
    }
  });

  /*----------helper fuction---------*/

  var searchPoint = function () {
    let a = search.inputBar();

    if (a.length == 12 || a.length == 10) {
      data = getLocal();
      console.log(data);
      let result = data.filter((row) => row.Quote_id == a || row.Ticket_no == a);
      contacts.removeAll();
      for (row of result) {
        contacts.unshift(row);
      }
    } else {
      getCurrentState();
    }
  };

  var addContact = function () {
    console.log("Adding new contact with Ticket_no: " + contact.Ticket_no() + " and Quote_id: " + contact.Quote_id());
    console.log("addContactCalled");
    console.log(contact.Ticket_no().length);

    if (contact.Ticket_no().length == 10 && contact.Quote_id().length == 12 && contact.Reason().length != 0 && contact.Change().length != 0) {
      var paylaod = {
        Ticket_no: contact.Ticket_no(),
        Quote_id: contact.Quote_id(),
        date: contact.date(),
        Reason: contact.Reason(),
        Change: contact.Change(),
      };
      contacts.unshift(paylaod);
      total(total() + 1);
      setLocalstorage(paylaod);
      clearContact();
      // visi(false);
    } else {
      console.log("error report");

      // visi(true);
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

    data.unshift(payload);

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

    // var trimdata = pagination(state.queryset, state.page, state.rows);

    // console.log("trimdata", trimdata);

    for (let i = 0; i < state.queryset.length; i++) {
      contacts.unshift(state.queryset[i]);
    }

    // pageButton(trimdata.pages);
    // total(data.length);
  };

  //   var pageButton = function (pages) {
  //     console.log("pages", pages);
  //     var tpagination = document.getElementById("tpagination");
  //
  //     console.log(tpagination);
  //
  //     tpagination.innerHTML = "";
  //
  //     for (let page = 1; page <= pages; page++) {
  //       tpagination.innerHTML += `<button value=${page} class="page ui blue basic button">${page}</button>`;
  //     }
  //
  //     $(".page").on("click", function () {
  //       console.log("onClick worked");
  //       $("#tbody").empty();
  //
  //       // state.page = $(this).val();
  //       console.log("state.page", state.page);
  //
  //       var trimdata = pagination(state.queryset, $(this).val(), state.rows);
  //       console.log("jqury", trimdata.queryset);
  //       for (let i = 0; i < trimdata.queryset.length; i++) {
  //         contacts.unshift(trimdata.queryset[i]);
  //       }
  //     });
  //   };

  //   var pagination = function (queryset, page, rows) {
  //     console.log("pagination");
  //     var trimStart = (page - 1) * rows;
  //     var trimEnd = trimStart + rows;
  //
  //     var trimData = queryset.slice(trimStart, trimEnd);
  //
  //     var pages = Math.ceil(queryset.length / rows);
  //
  //     return {
  //       queryset: trimData,
  //
  //       pages: pages,
  //     };
  //   };

  var clearTable = function () {
    console.log("table cleared");
    if (window.confirm("Are you sure want to delete all records permanently? click 'OK' to delete ")) {
      localStorage.clear();
    } else {
      console.log("didn't run");
    }
    window.location.reload();
  };

  var clearContact = function () {
    contact.Ticket_no(null);
    contact.Quote_id(null);
    contact.Reason("BUG");
    contact.Change(null);

    console.log("clearContact");
  };

  /*--------------Create excel sheet function---------------------*/

  var exportTableToExcel = function () {
    console.log("run");
    data = JSON.parse(localStorage.getItem("data"));
    console.log(data);
    /* make the worksheet */
    var ws = XLSX.utils.json_to_sheet(data);

    /* add to workbook */
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "People");

    n = new Date().toLocaleString();
    /* generate an XLSX file */
    XLSX.writeFile(wb, `${n}.xlsx`);
  };

  /*--------------Initialization of DOM[On every DOM Update]------------------------*/

  var init = function () {
    /*------------add code to initialize this module------------*/

    console.log("first console");
    document.body.style.zoom = 0.8;
    getCurrentState();
    // visi(false);
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
    exportTableToExcel: exportTableToExcel,
    searchPoint: searchPoint,

    search: search,
  };
})();
