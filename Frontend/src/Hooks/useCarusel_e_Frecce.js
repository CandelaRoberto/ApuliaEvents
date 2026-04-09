import { useRef, useState, useEffect } from "react";

export function useCarousel(items = []) {
    const scrollRef = useRef(null);
    const [canLeft, setCanLeft] = useState(false);
    const [canRight, setCanRight] = useState(true);

  const getResponsiveSizes = () => {
    if (window.innerWidth <= 480) {
        return { font: "0.9rem", padding: "12px", sidebar: 20, gap: 16, cardWidth: 280, posterHeight: 540 };
    }
    if (window.innerWidth <= 800) {
        return { font: "1rem", padding: "13px", sidebar: 240, gap: 18, cardWidth: 300, posterHeight: 580 };
    }
    if (window.innerWidth <= 1200) {
        return { font: "1.1rem", padding: "15px", sidebar: 240, gap: 22, cardWidth: 320, posterHeight: 620 };
    }
    return { font: "1.2rem", padding: "17px", sidebar: 240, gap: 26, cardWidth: 340, posterHeight: 660 };
};

    const [responsive, setResponsive] = useState(getResponsiveSizes());
    const [showArrows, setShowArrows] = useState(window.innerWidth >= 1200);

    // Frecce
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const check = () => {
            setCanLeft(el.scrollLeft > 0);
            setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
        };

        check();
        el.addEventListener("scroll", check);
        return () => el.removeEventListener("scroll", check);
    }, [items]);

    // Resize schermo
    useEffect(() => {
        const onResize = () => {
            setResponsive(getResponsiveSizes());
            setShowArrows(window.innerWidth >= 1200);
        };

        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);


    // Funzioni scroll
    const scrollLeft = () => {
        scrollRef.current?.scrollBy({ left: -450, behavior: "smooth" });
    };

    const scrollRight = () => {
        scrollRef.current?.scrollBy({ left: 450, behavior: "smooth" });
    };

    return {
        scrollRef,
        canLeft,
        canRight,
        scrollLeft,
        scrollRight,
        responsive,
        showArrows,
    };
}
