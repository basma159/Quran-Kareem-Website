
///// observer
const sections = document.querySelectorAll(".section")
const options = {
    threshold: .5,
    // rootMargin:"64px",
}

const observer = new IntersectionObserver((entries) => {
    const visibleSection = entries.find(el => el.isIntersecting)
    const a = document.querySelectorAll("header ul a").forEach(a => {
        const li = a.closest("li")
        if (visibleSection) {
            if ("#" + visibleSection.target.id == a.getAttribute("href")) {
                li.classList.add("bg-white")
                li.classList.add("text-[#273338]")
            }
            else {
                li.classList.remove("bg-white")
                li.classList.remove("text-[#273338]")
            }
        }
    })

}, options)

sections.forEach(section => {
    observer.observe(section)
})


// get reciters and suwars

const apiUrl = 'https://mp3quran.net/api/v3'
const language = 'ar'
async function getReciters() {
    const chooseReciters = document.querySelector("#chooseReciters")
    const response = await fetch(`${apiUrl}/reciters?language=${language}`)
    const data = await response.json()
    // console.log(data.reciters.length)

    chooseReciters.innerHTML = `<option value="">اختر قارئ</option>`
    const filterReciters = data.reciters.filter(item =>
        item.id !== 183 && item.id !== 184 && item.id !== 185)
    // console.log(filterReciters.length)

    filterReciters.forEach(reciter =>
        chooseReciters.innerHTML += `<option  value="${reciter.id}">${reciter.name}</option>`);
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

// surahs()

// Display pages of quran

const quranPages = document.querySelector("#quranPages");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");

async function chooseQuran() {
    try {
        const response = await fetch(
            "https://quran.yousefheiba.com/api/quranPagesImage"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch Quran pages");
        }
        const data = await response.json();
        const choosePage = document.querySelector("#choosePage")
        // البيانات موجودة داخل data.pages
        data.pages.forEach(page => {
            choosePage.innerHTML += `<option value="${page.page_number}" class="h-9">${page.page_number}</option>`

            const slide = document.createElement("div");
            slide.className =
                "swiper-slide flex justify-center items-center";
            slide.innerHTML = `
                <img
                    src="${page.page_url}"
                    alt="صفحة القرآن ${page.page_number}"
                    class="w-full max-w-[450px] h-[560px] object-contain rounded-xl"
                    loading="lazy">`;
            quranPages.appendChild(slide);
        });
        // إنشاء Swiper
        const swiper = new Swiper(".quranSwiper", {
            // البداية
            initialSlide: 0,
            rtl: true,
            // موبايل
            slidesPerView: 1,
            slidesPerGroup: 1,
            spaceBetween: 6,
            // الحركة
            speed: 500,
            // السحب باللمس
            allowTouchMove: true,
            grabCursor: true,
            touchRatio: 1,
            threshold: 5,
            resistanceRatio: 0.85,
            // مهم جداً
            loop: false,
            // Desktop
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    slidesPerGroup: 2,
                    spaceBetween: 20
                }
            }
        });
        choosePage.addEventListener("change", () => {
            const pageNumber = Number(choosePage.value)
            if (pageNumber) {
                return swiper.slideTo(pageNumber - 1)
            }
        })
        // زر السابق
        prevBtn.addEventListener("click", () => {
            swiper.slidePrev();
        });
        // زر التالي
        nextBtn.addEventListener("click", () => {
            swiper.slideNext();
        });
        // تحديث حالة الأزرار
        function updateButtons() {
            prevBtn.disabled = swiper.isBeginning;
            nextBtn.disabled = swiper.isEnd;
        }
        // أول مرة
        updateButtons();
        // كل ما الصفحة تتغير
        swiper.on("slideChange", updateButtons);
    }
    catch (error) {
        console.error("Error:", error);
    }
}
chooseQuran();

// tafsir quran

async function surahTafsir() {
    const chooseTafsir = document.querySelector("#chooseTafsir")
    // https://www.mp3quran.net/api/v3/tafsir?tafsir=1&language=ar
    const response = await fetch(`${apiUrl}/tafsir?tafsir=1&language=${language}`)
    const data = await response.json()
    // console.log(data.tafasir)
    chooseTafsir.innerHTML = `<option>اختر سورة</option>`

    data.tafasir.soar.forEach((item) => {
        chooseTafsir.innerHTML += `<option value="${item.id}" data-url="${item.url}">${item.name}</option>`
    })
    chooseTafsir.addEventListener("change", e => {
        const selecteTafsir = chooseTafsir.options[chooseTafsir.selectedIndex]
        playTasir(selecteTafsir.dataset.url)
    })
}
surahTafsir()

async function playTasir(Tafasir) {
    const tafsir = document.querySelector("#tafsir")
    tafsir.src = Tafasir
    tafsir.play()
}
//surahs of quran 
// async function surahs() {
//     const container = document.querySelector(".container1")
//     const response = await fetch('http://api.alquran.cloud/v1/meta')
//     const data = await response.json()
//     // console.log(data.data.surahs.references)
//     data.data.surahs.references.forEach(item => {
//         container.innerHTML += `<div class="text-[#273338] font-bold bg-white py-2 md:text-sm lg:text-lg rounded-lg hover:ring-1 hover:ring-[#273338]
//         flex flex-col justify-center items-center gap-2 cursor-pointer hover:shadow-lg hover:shadow-black">
//         <p>${item.name}</p>
//         <p>${item.englishName}</p>
//         </div>`
//     })

// }


async function displayQuran(display) {
    const displayQuran = document.querySelector("#displayQuran")
    displayQuran.src = display
}


// tadabor quran

async function surahTadabor() {
    const chooseTadabor = document.querySelector("#chooseTadabor")
    // https://mp3quran.net/api/v3/tadabor?sura=3&language=ar
    const response = await fetch(`${apiUrl}/tadabor?sura=3&language=${language}`)
    const data = await response.json()
    chooseTadabor.innerHTML = `<option>اختر آية</option>`

    data.tadabor['3'].forEach((item) => {
        chooseTadabor.innerHTML += `<option value="${item.id}" data-url="${item.video_url}">${item.title}</option>`
    })
    chooseTadabor.addEventListener("change", e => {
        const selecteTadabor = chooseTadabor.options[chooseTadabor.selectedIndex]
        playTadabor(selecteTadabor.dataset.url)
    })
}
surahTadabor()

async function playTadabor(Tadabor) {
    const tadabor = document.querySelector("#tadabor")
    tadabor.src = Tadabor
    tadabor.play()
}
//reading quran

// async function readingQuran() {
//     const response = await fetch('https://api.alquran.cloud/v1/page/1/quran-uthmani')
//     const data = await response.json()
//     console.log(data)
// }

// readingQuran()
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



