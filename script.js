const locBtn = document.getElementById("locBtn");
const infoBox = document.getElementById("info");
const latEl = document.getElementById("lat");
const lonEl = document.getElementById("lon");
const countryEl = document.getElementById("country");
const cityEl = document.getElementById("city");
const addressEl = document.getElementById("address");

let map, marker;

locBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Brauzeringiz joylashuvni qo‘llab-quvvatlamaydi!");
    return;
  }

  navigator.geolocation.getCurrentPosition(success, error, {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  });
});

async function success(pos) {
  const lat = pos.coords.latitude.toFixed(6);
  const lon = pos.coords.longitude.toFixed(6);

  latEl.textContent = lat;
  lonEl.textContent = lon;
  infoBox.style.display = "block";

  // Reverse geocoding (Nominatim)
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
    const data = await res.json();
    const addr = data.address || {};
    countryEl.textContent = addr.country || "—";
    cityEl.textContent = addr.city || addr.town || addr.village || "—";
    addressEl.textContent = data.display_name || "—";
  } catch (e) {
    console.error("Reverse geocoding xatolik:", e);
  }

  // Karta
  if (!map) {
    map = L.map("map").setView([lat, lon], 14);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap"
    }).addTo(map);
    marker = L.marker([lat, lon]).addTo(map).bindPopup("Sizning joylashuvingiz").openPopup();
  } else {
    map.setView([lat, lon], 14);
    marker.setLatLng([lat, lon]);
  }
}

function error(err) {
  alert("Joylashuv aniqlanmadi: " + err.message);
}
