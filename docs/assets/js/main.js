(function () {
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("mainNav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  var booksToggle = document.getElementById("booksToggle");
  var booksMenu = document.getElementById("booksMenu");
  if (booksToggle && booksMenu) {
    booksToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = booksMenu.classList.toggle("open");
      booksToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      if (!booksMenu.contains(e.target) && e.target !== booksToggle) {
        booksMenu.classList.remove("open");
        booksToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  var year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
})();
