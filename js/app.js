const WACHTWOORD_1 = "lindenhof";
const KLUIS_CODE = "1984";

function checkLogin() {
    const input = document.getElementById('pass1').value.toLowerCase();
    if(input === WACHTWOORD_1) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
    } else {
        alert("ACCESS DENIED");
    }
}

// Deze functie laadt tekst uit de losse HTML bestanden in de 'content' map
async function loadContent(url) {
    const response = await fetch(url);
    const text = await response.text();
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('content-viewer').classList.remove('hidden');
    document.getElementById('content-area').innerHTML = text;
}

function showDashboard() {
    document.getElementById('content-viewer').classList.add('hidden');
    document.getElementById('kluis-screen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
}

function openKluis() {
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('kluis-screen').classList.remove('hidden');
}

function checkKluis() {
    const val = document.getElementById('pass2').value;
    if(val === KLUIS_CODE) {
        document.getElementById('kluis-screen').innerHTML = `
            <h2>TOEGANG VERLEEND</h2>
            <p>COORDINATEN:</p>
            <h1 style="color:white">N 51° 12.345<br>E 003° 54.321</h1>
        `;
    } else {
        alert("CODE ONJUIST");
    }
}