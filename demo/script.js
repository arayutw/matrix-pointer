const tableE = document.getElementById("table");

const map = new Map;

Array.from(tableE.getElementsByTagName("tr")).map((trE) => Array.from(trE.getElementsByTagName("td")).filter((tdE) => "NULL" !== tdE.textContent).forEach((tdE) => map.set(tdE.textContent, tdE)));

const matrixPointer = self.matrixPointer = new MatrixPointer({
  matrix: () => Array.from(tableE.getElementsByTagName("tr")).map((trE) => Array.from(trE.getElementsByTagName("td")).map((tdE) => "NULL" === tdE.textContent ? null : tdE.textContent)),
  loop: {
    x: true,
    y: true,
  },
  loose: {
    x: true,
    y: true,
  },
  jump: {
    x: true,
    y: true,
  },
});

matrixPointer.on("focus", (event) => {
  console.log("focus event:", event);

  const focusE = map.get(event.id);

  Array.from(map.values()).forEach((element) => {
    element.classList.remove("focus");
  });

  focusE.classList.add("focus");
});

addEventListener("keydown", (event) => {

});

matrixPointer.moveTo(0, 0);

document.querySelectorAll("input[type=checkbox]").forEach((inputE) => {
  inputE.addEventListener("change", () => {
    document.querySelectorAll("input[type=checkbox]").forEach((inputE) => {
      matrixPointer[inputE.name][inputE.value] = inputE.checked;
    });
  }, {
    passive: true,
  });
});

Array.from(document.getElementsByClassName("moveby")).forEach((aE) => {
  aE.addEventListener("click", (event) => {
    event.preventDefault();

    console.log("?", event.currentTarget.dataset.direction);

    matrixPointer.moveBy(
      ["2", "4",].indexOf(event.currentTarget.dataset.direction) > -1 ? "x" : "y",
      ["2", "3",].indexOf(event.currentTarget.dataset.direction) > -1 ? true : false
    );
  }, {
    passive: false,
  })
})

console.log("matrixPointer:", matrixPointer);