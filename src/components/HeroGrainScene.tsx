import { useEffect } from "react";

export function HeroGrainScene({ routeKey }: { routeKey: string }) {
  useEffect(() => {
    let disposed = false;
    let teardown: () => void = () => undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    void import("../three/grainRuntime").then(({ mountGrainScene }) => {
      if (disposed) return;
      const host = document.querySelector<HTMLElement>(".hero, .page-hero");
      if (host) teardown = mountGrainScene(host);
    }).catch(() => undefined);

    return () => {
      disposed = true;
      teardown();
    };
  }, [routeKey]);

  return null;
}
