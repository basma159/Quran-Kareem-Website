// get reciters and suwars

const apiUrl = 'https://mp3quran.net/api/v3'
const language = 'ar'
async function getReciters() {
    const chooseReciters = document.querySelector("#chooseReciters")
    const response = await fetch(`${apiUrl}/reciters?language=${language}`)
    const data = await response.json()

    chooseReciters.innerHTML = `<option value="">اختر قارئ</option>`
    data.reciters.forEach(reciter => chooseReciters.innerHTML += `<option  value="${reciter.id}">${reciter.name}</option>`);

    chooseReciters.addEventListener('change', (e) => getRewayah(e.target.value))
}

getReciters()

async function getRewayah(reciter) {
    const chooseRewayah = document.querySelector("#chooseRewayah")
    const response = await fetch(`${apiUrl}/reciters?language=${language}&reciter=${reciter}`)
    const data = await response.json()
    chooseRewayah.innerHTML = ""
    chooseRewayah.innerHTML = `<option value="" data-server="" data-surah-list="">اختر رواية أو مصحف</option>`

    data.reciters[0].moshaf.forEach(rewayah => {
        chooseRewayah.innerHTML += `<option value="${rewayah.id}" data-server="${rewayah.server}" data-surah-list="${rewayah.surah_list}">
        ${rewayah.name}</option>`
    });
    chooseRewayah.addEventListener('change', e => {
        const selecteRewayah = chooseRewayah.options[chooseRewayah.selectedIndex]
        const surahServer = (selecteRewayah.dataset.server)
        const surahList = (selecteRewayah.dataset.surahList)
        getSurah(surahServer, surahList)
    })
}

async function getSurah(surahServer, surahList) {
    const chooseSurah = document.querySelector("#chooseSurah")
    const response = await fetch(`https://mp3quran.net/api/v3/suwar`)
    const data = await response.json()
    const surahNames = data.suwar

    surahList = surahList.split(',')
    chooseSurah.innerHTML = `<option value="">اختر سورة</option>`

    surahList.forEach(surah => {
        const padSurah = surah.padStart(3, '0')

        surahNames.forEach(surahName => {
            if (surahName.id == surah) {
                chooseSurah.innerHTML += `<option value="${surahServer}${padSurah}.mp3">${surahName.name}</option>`
            }
        })
    })
    chooseSurah.addEventListener('change', e => {
        const selecteSurah = chooseSurah.options[chooseSurah.selectedIndex]
        playAudio(selecteSurah.value)
    })

}

async function playAudio(surahMp3) {
    const playSurah = document.querySelector("#playSurah")
    playSurah.src = surahMp3
    playSurah.play()
}
//readind quran

async function readingQuran() {
    const response = await fetch('https://api.alquran.cloud/v1/page/1/quran-uthmani')
    const data = await response.json()
    console.log(data)
}

readingQuran()
// player Radio of Reciters

function getRadios() {
    const chooseReciter = document.querySelector("#chooseReciter")
    chooseReciter.innerHTML = `<option data-id="" data-url="">اختر الإذاعة</option>`

    fetch('https://www.mp3quran.net/api/v3/radios')
        .then(response => response.json())
        .then(data => data.radios.forEach((reciter) => {
            chooseReciter.innerHTML += `<option data-id="${reciter.id}" data-url="${reciter.url}" >${reciter.name}</option>`
        }))
    chooseReciter.addEventListener('change', e => {
        const selecteRadio = chooseReciter.options[chooseReciter.selectedIndex]
        // console.log(selecteRadio.dataset.url)
        playRadio(selecteRadio.dataset.url)
    })
}

getRadios()

async function playRadio(Radio) {
    const radio = document.querySelector("#radio")
    radio.src = Radio
    radio.play()
}

//player live TV channels ( Makkah and Madinah)

function playLive(channel) {
    if (Hls.isSupported()) {
        var video = document.getElementById('liveVideo');
        var hls = new Hls();
        hls.loadSource(`${channel}`);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play()
        })
    }
}



