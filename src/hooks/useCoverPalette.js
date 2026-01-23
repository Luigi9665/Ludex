import { useEffect, useState } from "react";
import { FastAverageColor } from "fast-average-color";

/**
 * Hook per estrarre una palette di colori dalla cover del gioco
 * @param {string} coverUrl - URL della cover image
 */
export function useCoverPalette(coverUrl) {
  const [state, setState] = useState({
    mainColor: null,
    secondaryColor: null,
    accentColor: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!coverUrl) {
      setState((prev) => ({
        ...prev,
        mainColor: null,
        secondaryColor: null,
        accentColor: null,
        loading: false,
        error: new Error("No cover URL provided"),
      }));
      return;
    }

    let isMounted = true;
    const fac = new FastAverageColor();

    const run = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        // opzionale: proxy backend per evitare CORS
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const isAbsolute = /^https?:\/\//i.test(coverUrl);

        const imageUrl = isAbsolute && baseUrl ? `${baseUrl}/api/Image/proxy-image?url=${encodeURIComponent(coverUrl)}` : coverUrl;

        const img = new Image();
        img.crossOrigin = "anonymous";

        const loadImage = new Promise((resolve, reject) => {
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("Failed to load image"));
        });

        img.src = imageUrl;
        await loadImage;

        if (!isMounted) return;

        const color = await fac.getColorAsync(img);
        if (!isMounted || !color || !Array.isArray(color.value)) return;

        const [r, g, b] = color.value;

        // principale un po’ scurito
        const mainColor = `rgb(${Math.floor(r * 0.6)}, ${Math.floor(g * 0.6)}, ${Math.floor(b * 0.6)})`;

        // secondario ancora più scuro
        const secondaryColor = `rgb(${Math.floor(r * 0.3)}, ${Math.floor(g * 0.3)}, ${Math.floor(b * 0.3)})`;

        // accent più saturo
        const max = Math.max(r, g, b);
        const accentR = max === r ? Math.min(255, r * 1.2) : r * 0.8;
        const accentG = max === g ? Math.min(255, g * 1.2) : g * 0.8;
        const accentB = max === b ? Math.min(255, b * 1.2) : b * 0.8;
        const accentColor = `rgb(${Math.floor(accentR)}, ${Math.floor(accentG)}, ${Math.floor(accentB)})`;

        setState({
          mainColor,
          secondaryColor,
          accentColor,
          loading: false,
          error: null,
        });
      } catch (err) {
        if (!isMounted) return;

        console.warn("Failed to extract colors from cover:", err);
        // fallback ai colori Ludex
        setState({
          mainColor: "rgb(45, 20, 70)",
          secondaryColor: "rgb(15, 5, 25)",
          accentColor: "rgb(138, 43, 226)",
          loading: false,
          error: err,
        });
      } finally {
        fac.destroy();
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [coverUrl]);

  return state;
}
