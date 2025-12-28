const CAR_LOGO_MAP: { key: string; src: string; alt: string }[] = [
    { key: "bmw", src: "/cars/bmw.png", alt: "BMW" },
    { key: "ferrari", src: "/cars/ferrari.png", alt: "Ferrari" },
    { key: "porsche", src: "/cars/porsche.png", alt: "Porsche" },
    { key: "mercedes", src: "/cars/mercedes.png", alt: "Mercedes" },
    { key: "lamborghini", src: "/cars/lamborghini.png", alt: "Lamborghini" },
    { key: "mclaren", src: "/cars/mclaren.png", alt: "McLaren" },
    { key: "chevrolet", src: "/cars/chevrolet.png", alt: "Chevrolet" },
    { key: "ford", src: "/cars/ford.png", alt: "Ford" },
    { key: "aston", src: "/cars/aston.png", alt: "Aston" },
];

function normalizeCarName(name?: string) {
    return (name ?? "").toLowerCase().trim();
}

export function getCarLogo(carName?: string) {
    const normalized = normalizeCarName(carName);
    return CAR_LOGO_MAP.find((m) => normalized.includes(m.key)) ?? null;
}
