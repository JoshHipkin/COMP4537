// ChatGPT was used to help in saving and reading to local storage.

class textArea {
  constructor(id, value = "", readOnly = false) {
    this.id = id;
    this.value = value;
    this.readOnly = readOnly;
    this.textArea = document.createElement("textarea");
    this.removeButton = document.createElement("button");
    this.create();
  }

  create() {
    this.textArea.value = this.value;
    this.textArea.id = `textarea-${this.id}`;
    this.textArea.readOnly = this.readOnly;
    this.textArea.style.width = "100%";
    this.textArea.style.marginBottom = "10px";

    this.removeButton.innerText = "remove";
    this.removeButton.style.marginLeft = "10px";
    this.removeButton.style.height = "40px";
    this.removeButton.addEventListener("click", () => this.removeTextArea());

    this.addToContainer();

    this.textArea.addEventListener("input", () => this.saveToLocalStorage());
  }

  addToContainer() {
    const container = document.getElementById("container");
    const wrapper = document.createElement("div");
    wrapper.id = `wrapper-${this.id}`;
    wrapper.style.display = "flex";
    wrapper.style.display = "center";
    wrapper.style.marginBottom = "10px";
    wrapper.appendChild(this.textArea);
    wrapper.appendChild(this.removeButton);

    container.appendChild(wrapper);
  }

  saveToLocalStorage() {
    const textAreas = JSON.parse(localStorage.getItem("textAreas")) || {};
    textAreas[this.id] = this.textArea.value;
    localStorage.setItem("textAreas", JSON.stringify(textAreas));

    const time = new Date().toLocaleString();
    document.getElementById("lastSaved").innerText = `Last Saved: ${time}`;
  }

  removeTextArea() {
    document.getElementById(`wrapper-${this.id}`).remove();
    const textAreas = JSON.parse(localStorage.getItem("textAreas"));
    delete textAreas[this.id];
    localStorage.setItem("textAreas", JSON.stringify(textAreas));
  }
}

class Writer {
  constructor() {
    this.storedat = null;
    this.count = 1;
    this.loadLocalStorage();
    document
      .getElementById("addTextArea")
      .addEventListener("click", () => this.addNewTextArea());
  }

  addNewTextArea() {
    new textArea(this.count);
    this.count++;
  }

  loadLocalStorage() {
    const data = localStorage.getItem("textAreas");
    let textAreas = {};
    if (data) {
      textAreas = JSON.parse(data);
      for (const id in textAreas) {
        new textArea(id, textAreas[id], false);
      }
    }

    this.count = Object.keys(textAreas).length + 1;
  }
}

class Reader {
  constructor() {
    this.loadLocalStorage();
    this.autoRefresh();
  }

  loadLocalStorage() {
    const container = document.getElementById("container");
    container.innerHTML = "";
    const data = localStorage.getItem("textAreas");
    let textAreas = {};
    if (data) {
      textAreas = JSON.parse(data);
      for (const id in textAreas) {
        new textArea(id, textAreas[id], true);
      }
      const time = new Date().toLocaleString();
      document.getElementById(
        "lastRetrieved"
      ).innerText = `Last Retrieved: ${time}`;
    }
  }

  autoRefresh() {
    setInterval(() => {
      this.loadLocalStorage();
    }, 2000);
  }
}

window.onload = function () {
  if (document.title == "Writer") {
    new Writer();
  } else if (document.title == "Reader") {
    new Reader();
  }
};
