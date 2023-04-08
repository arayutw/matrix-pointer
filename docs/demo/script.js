const tableE = document.getElementById("table");

const matrixPointer = self.matrixPointer = new MatrixPointer({
  /*
    [
      [td, td, td,...],
      [td, td, td,...],
      [td, td, td,...],
      // ...
    ]
  */
  matrix: () => Array.from(tableE.getElementsByTagName("tr")).map((trE) => Array.from(trE.getElementsByTagName("td")).map((tdE) => "NULL" === tdE.textContent ? null : tdE)),
  loop: {
    x: true,
    y: true,
  },
  loose: {
    x: false,
    y: false,
  },
  jump: {
    x: true,
    y: true,
  },
});

// events
matrixPointer.on("focus", (event) => {
  console.log("focus event:", event);

  event.id.classList.add("bg-red-300");
});

matrixPointer.on("blur", (event) => {
  console.log("blur event:", event);

  event.id.classList.remove("bg-red-300");
});

// keyboard controls
addEventListener("keydown", (event) => {
  matrixPointer.moveBy(
    ["ArrowLeft", "ArrowRight",].indexOf(event.key) > -1 ? "x" : "y",
    ["ArrowRight", "ArrowDown",].indexOf(event.key) > -1 ? true : false
  );
});

matrixPointer.moveTo(0, 0);

// checkboxes
const checkboxHandler = () => {
  document.querySelectorAll("input[type=checkbox]").forEach((inputE) => {
    matrixPointer[inputE.name][inputE.value] = inputE.checked;
  });
};

document.querySelectorAll("input[type=checkbox]").forEach((inputE) => {
  inputE.addEventListener("change", checkboxHandler, {
    passive: true,
  });
});

checkboxHandler();

// button controls
Array.from(document.getElementsByClassName("moveby")).forEach((aE) => {
  aE.addEventListener("click", (event) => {
    event.preventDefault();

    matrixPointer.moveBy(
      ["2", "4",].indexOf(event.currentTarget.dataset.direction) > -1 ? "x" : "y",
      ["2", "3",].indexOf(event.currentTarget.dataset.direction) > -1 ? true : false
    );
  }, {
    passive: false,
  })
})

console.log("matrixPointer:", matrixPointer);