// ==========================================
// CONFIGURASI SEO & SCHEMA MARKUP (JSON-LD)
// ==========================================

function injectLocalBusinessSEO() {
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "AutoRepair",
        "name": "PEROT MOTOR - Bengkel Motor Profesional & Modern",
        "image": "https://bengkel-anda.com/assets/hero-bengkel.jpg",
        "@id": "https://bengkel-anda.com",
        "url": "https://bengkel-anda.com",
        "telephone": "+6285764061435",
        "priceRange": "$$",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Jl. Raya Otomotif No. 45, Blok C",
            "addressLocality": "Jakarta Selatan",
            "addressRegion": "DKI Jakarta",
            "postalCode": "12345",
            "addressCountry": "ID"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": -6.200000,
            "longitude": 106.816666
        },
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "opens": "08:00",
                "closes": "17:00"
            }
        ],
        "potentialAction": {
            "@type": "ReserveAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://bengkel-anda.com/#booking",
                "actionPlatform": [
                    "http://schema.org/DesktopWebPlatform",
                    "http://schema.org/MobileWebPlatform"
                ]
            },
            "result": {
                "@type": "Reservation",
                "name": "Booking Servis Motor Online"
            }
        }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);
}

document.addEventListener("DOMContentLoaded", () => {
    injectLocalBusinessSEO();
    optimizeMetaTags(
        "PEROT MOTOR - Bengkel Motor Profesional & Booking Online",
        "Servis rutin, perbaikan mesin, dan ganti oli motor tanpa antre. Lacak status servis motor Anda secara real-time di Jakarta Selatan."
    );
});

function optimizeMetaTags(title, description) {
    document.title = title;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;
}
