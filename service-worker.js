const CACHE_NAME = "Quran-web-v2"
const FILES_TO_CACHE = [
    // "/",
    "/index.html",
    "/css/style.css",
    "/css/all.css",
    "/js/script.js",
    "/images/icon-192.png",
    "/images/icon-512.png"
]

self.addEventListener("install", (event) => {
    event.waitUntil(caches.open(CACHE_NAME)
        .then((cache)=>{
            return cache.addAll(FILES_TO_CACHE)
        })
    )
})



// self.addEventListener("install", (event) => {
//     event.waitUntil(
//         caches.open(CACHE_NAME)
//             .then((cache) => {
//                 console.log("Cache opened");

//                 return cache.addAll(FILES_TO_CACHE);
//             })
//             .then(() => {
//                 console.log("All files cached successfully");
//             })
//             .catch((error) => {
//                 console.error("CACHE ERROR:", error);
//             })
//     );
// });

/// offline

// self.addEventListener("fetch", (event) => {
//     event.respondWith(
//         caches.match(event.request)
//             .then((response) => {
//                 return response || fetch(event.request);
//             })
//     );
// });