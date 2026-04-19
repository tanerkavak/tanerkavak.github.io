const input = document.getElementById("input");
const terminal = document.getElementById("terminal");

let step = -1;

let formData = {
  name: "",
  email: "",
  subject: "",
  message: ""
};

let messageBuffer = [];

function print(text) {
  const div = document.createElement("div");
  div.classList.add("line");
  div.innerHTML = text;
  terminal.insertBefore(div, input.parentElement);
}

function ask() {
  switch(step) {
    case 0: print("Ad soyad girin:"); break;
    case 1: print("Mail girin:"); break;
    case 2: print("Konu girin (Destek / Diğer):"); break;
    case 3: print("Mesaj girin (bitirmek için ':wq'):"); break;
    case 4: print("Gönderilsin mi? (y/n)"); break;
  }
}

function resetForm() {
  step = -1;
  formData = { name: "", email: "", subject: "", message: "" };
  messageBuffer = [];
}

input.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    const value = input.value.trim();

    if (value.toLowerCase() === "reload") {
      location.reload();
      return;
    }

    print(`<span class="prompt">$</span> ${value}`);
    input.value = "";

    if (value.toLowerCase() === "start" && step === -1) {
      step = 0;
      ask();
      return;
    }

    if (step === -1) {
      print("Başlamak için 'start' yaz.");
      return;
    }

    if (step === 0) {
      formData.name = value;
      step++;
      ask();
    }

    else if (step === 1) {
      formData.email = value;
      step++;
      ask();
    }

    else if (step === 2) {
      formData.subject = value;
      step++;
      ask();
    }
else if (step === 3) {
  if (value.trim().endsWith(":wq")) {
    // :wq sonda ise mesajı bitir

    // :wq kısmını mesajdan temizle
    const cleaned = value.replace(/:wq\s*$/, "").trim();

    if (cleaned) {
      messageBuffer.push(cleaned);
    }

    formData.message = messageBuffer.join(" ");
    messageBuffer = [];
    step++;
    ask();
  } else {
    messageBuffer.push(value);
  }
}
    else if (step === 4) {
      if (value.toLowerCase() === "y") {
        print("<span class='highlight'>Mesaj gönderilemedi. Backend bağlı değil.</span>");
      } else {
        print("İptal edildi. ");
      }

      print("Yeni form için 'start'");
      resetForm();
    }
  }
});