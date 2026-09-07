"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import L, {
  type Layer,
  type LeafletMouseEvent,
  type Map as LeafletMap,
} from "leaflet";

import "leaflet/dist/leaflet.css";

import gsap from "gsap";

import MapHUD from "./map-hud";
import MapCompass from "./map-compass";
import CountryDiscovery from "./country-discovery";
import MagicalShip from "./magical-ship";

import {
  CONFIG,
} from "@/lib/config";

import {
  fetchMedia,
  type ExpeditionMedia,
} from "@/lib/media";

import {
  haversineDistance,
  interpolateGreatCircle,
} from "@/lib/geo";

interface CountryRecord {
  feature: any;
  name: string;
}

export default function VoyageMap() {
  const mapElement =
    useRef<HTMLDivElement>(null);

  const mapRef =
    useRef<LeafletMap | null>(null);

  const countriesLayerRef =
    useRef<L.GeoJSON | null>(null);

  const shipRef =
    useRef<L.Marker | null>(null);

  const routeRef =
    useRef<L.Polyline | null>(null);

  const destinationRef =
    useRef<L.CircleMarker | null>(null);

  const animationRef =
    useRef<number | null>(null);

  const selectedLayerRef =
    useRef<Layer | null>(null);

  const countriesRef =
    useRef<CountryRecord[]>([]);

  const [countryCount, setCountryCount] =
    useState(0);

  const [voyages, setVoyages] =
    useState(0);

  const [distance, setDistance] =
    useState(0);

  const [selectedCountry, setSelectedCountry] =
    useState("");

  const [discoveryOpen, setDiscoveryOpen] =
    useState(false);

  const [discoveryMedia, setDiscoveryMedia] =
    useState<ExpeditionMedia[]>([]);

  const [discoveryIndex, setDiscoveryIndex] =
    useState(0);

  const selectedCountryState =
    useRef("");

  const totalDistanceRef =
    useRef(0);

  const voyageCountRef =
    useRef(0);

  const escapeHTML = useCallback(
    (value: unknown) =>
      String(value ?? "")
        .replace(
          /&/g,
          "&amp;"
        )
        .replace(
          /</g,
          "&lt;"
        )
        .replace(
          />/g,
          "&gt;"
        )
        .replace(
          /"/g,
          "&quot;"
        )
        .replace(
          /'/g,
          "&#039;"
        ),
    []
  );

  const countryStyle =
    useCallback(() => {
      return {
        color: "#765124",
        weight: 1,
        opacity: 0.85,
        fillColor: "#c7a766",
        fillOpacity: 0.32,
      };
    }, []);

  const hoverStyle =
    useCallback(() => {
      return {
        color: "#ffe3a0",
        weight: 2,
        fillColor: "#dcb96e",
        fillOpacity: 0.56,
      };
    }, []);

  const selectedStyle =
    useCallback(() => {
      return {
        color: "#6ee9ff",
        weight: 2.5,
        fillColor: "#3d8f99",
        fillOpacity: 0.52,
        dashArray: "5 4",
      };
    }, []);

  const createShipIcon =
    useCallback(() => {
      return L.divIcon({
        className:
          "ancient-ship-marker",

        html: `
          <div class="ship-html-marker">
            <div class="ship-html-wake"></div>

            <div class="ship-html-hull"></div>

            <div class="ship-html-mast"></div>

            <div class="ship-html-sail"></div>

            <div class="ship-html-flag"></div>

            <div class="ship-html-glow"></div>
          </div>
        `,

        iconSize: [90, 90],
        iconAnchor: [45, 45],
      });
    }, []);

  const startVoyage =
    useCallback(
      (
        destination: {
          lat: number;
          lng: number;
        },
        country: string
      ) => {
        const map = mapRef.current;

        if (!map) return;

        const ship =
          shipRef.current;

        if (!ship) return;

        const start =
          ship.getLatLng();

        const end =
          L.latLng(
            destination.lat,
            destination.lng
          );

        if (
          animationRef.current
        ) {
          cancelAnimationFrame(
            animationRef.current
          );
        }

        routeRef.current?.remove();
        destinationRef.current?.remove();

        const voyageDistance =
          haversineDistance(
            start,
            end
          );

        if (
          voyageDistance < 1
        ) {
          return;
        }

        totalDistanceRef.current +=
          voyageDistance;

        voyageCountRef.current += 1;

        setDistance(
          totalDistanceRef.current
        );

        setVoyages(
          voyageCountRef.current
        );

        const route =
          L.polyline([], {
            color: "#62e9ff",
            weight: 2,
            opacity: 0.82,
            dashArray: "7 9",
            className:
              "magical-voyage-route",
          }).addTo(map);

        routeRef.current = route;

        const destinationMarker =
          L.circleMarker(end, {
            radius: 7,
            color: "#ffe29b",
            weight: 2,
            fillColor: "#5de5ff",
            fillOpacity: 0.78,
          }).addTo(map);

        destinationMarker.bindTooltip(
          escapeHTML(country)
        );

        destinationRef.current =
          destinationMarker;

        const startTime =
          performance.now();

        const duration =
          Math.min(
            CONFIG.SHIP_SPEED,
            Math.max(
              2500,
              voyageDistance * 3.5
            )
          );

        function animate(
          now: number
        ) {
          const elapsed =
            now - startTime;

          const raw = Math.min(
            elapsed / duration,
            1
          );

          const t =
            raw < 0.5
              ? 2 * raw * raw
              : 1 -
                Math.pow(
                  -2 * raw + 2,
                  2
                ) /
                  2;

          const position =
            interpolateGreatCircle(
              start,
              end,
              t
            );

          ship.setLatLng(
            position
          );

          const points = [];

          const segments =
            Math.max(
              2,
              Math.ceil(
                t * 80
              )
            );

          for (
            let i = 0;
            i <= segments;
            i++
          ) {
            const segmentT =
              t *
              (i / segments);

            const point =
              interpolateGreatCircle(
                start,
                end,
                segmentT
              );

            points.push([
              point.lat,
              point.lng,
            ]);
          }

          route.setLatLngs(
            points
          );

          if (raw < 1) {
            animationRef.current =
              requestAnimationFrame(
                animate
              );
          } else {
            animationRef.current =
              null;

            destinationMarker.setStyle({
              radius: 9,
              fillOpacity: 0.95,
            });
          }
        }

        animationRef.current =
          requestAnimationFrame(
            animate
          );
      },
      [escapeHTML]
    );

  const openCountry =
    useCallback(
      async (
        country: string,
        layer: Layer,
        latLng: L.LatLng
      ) => {
        const map =
          mapRef.current;

        if (!map) return;

        if (
          selectedLayerRef.current
        ) {
          (
            selectedLayerRef.current as L.Path
          ).setStyle(
            countryStyle()
          );
        }

        selectedLayerRef.current =
          layer;

        (
          layer as L.Path
        ).setStyle(
          selectedStyle()
        );

        selectedCountryState.current =
          country;

        setSelectedCountry(
          country
        );

        map.flyTo(
          latLng,
          Math.max(
            map.getZoom(),
            3
          ),
          {
            duration: 1.1,
          }
        );

        setDiscoveryOpen(
          true
        );

        setDiscoveryMedia([]);

        setDiscoveryIndex(0);

        try {
          const results =
            await Promise.allSettled([
              fetchMedia(
                "image",
                country,
                CONFIG.COUNTRY_MEDIA_LIMIT
              ),

              fetchMedia(
                "video",
                country,
                CONFIG.COUNTRY_MEDIA_LIMIT
              ),
            ]);

          if (
            selectedCountryState.current !==
            country
          ) {
            return;
          }

          const media: ExpeditionMedia[] =
            [];

          for (const result of results) {
            if (
              result.status ===
              "fulfilled"
            ) {
              media.push(
                ...result.value
              );
            }
          }

          const unique =
            media.filter(
              (
                item,
                index,
                array
              ) =>
                array.findIndex(
                  (other) =>
                    other.url ===
                    item.url
                ) === index
            );

          setDiscoveryMedia(
            unique
          );
        } catch (error) {
          console.error(
            "Country media failed:",
            error
          );
        }

        startVoyage(
          latLng,
          country
        );
      },
      [
        countryStyle,
        selectedStyle,
        startVoyage,
      ]
    );

  const resetVoyage =
    useCallback(() => {
      const map =
        mapRef.current;

      if (!map) return;

      if (
        animationRef.current
      ) {
        cancelAnimationFrame(
          animationRef.current
        );

        animationRef.current =
          null;
      }

      routeRef.current?.remove();

      destinationRef.current?.remove();

      if (
        selectedLayerRef.current
      ) {
        (
          selectedLayerRef.current as L.Path
        ).setStyle(
          countryStyle()
        );
      }

      selectedLayerRef.current =
        null;

      selectedCountryState.current =
        "";

      totalDistanceRef.current =
        0;

      voyageCountRef.current =
        0;

      setDistance(0);
      setVoyages(0);

      setSelectedCountry("");

      setDiscoveryMedia([]);

      setDiscoveryIndex(0);

      setDiscoveryOpen(false);

      shipRef.current?.setLatLng(
        CONFIG.MAP_CENTER
      );

      map.flyTo(
        CONFIG.MAP_CENTER,
        CONFIG.INITIAL_ZOOM,
        {
          duration: 1,
        }
      );
    }, [countryStyle]);

  useEffect(() => {
    window.addEventListener(
      "voyage:reset",
      resetVoyage
    );

    return () =>
      window.removeEventListener(
        "voyage:reset",
        resetVoyage
      );
  }, [resetVoyage]);

  useEffect(() => {
    const handler =
      (event: Event) => {
        const custom =
          event as CustomEvent<string>;

        const query =
          custom.detail
            ?.normalize("NFD")
            .replace(
              /[\u0300-\u036f]/g,
              ""
            )
            .toLowerCase()
            .trim();

        if (!query) return;

        const match =
          countriesRef.current.find(
            (item) =>
              item.name
                .normalize("NFD")
                .replace(
                  /[\u0300-\u036f]/g,
                  ""
                )
                .toLowerCase() ===
              query
          ) ??
          countriesRef.current.find(
            (item) =>
              item.name
                .normalize("NFD")
                .replace(
                  /[\u0300-\u036f]/g,
                  ""
                )
                .toLowerCase()
                .includes(query)
          );

        if (!match) return;

        const layer =
          countriesLayerRef.current;

        if (!layer) return;

        let target:
          | Layer
          | null = null;

        layer.eachLayer(
          (candidate) => {
            if (
              (
                candidate as any
              ).feature ===
              match.feature
            ) {
              target = candidate;
            }
          }
        );

        if (!target) return;

        try {
          const geoLayer =
            L.geoJSON(
              match.feature
            );

          const center =
            geoLayer
              .getBounds()
              .getCenter();

          openCountry(
            match.name,
            target,
            center
          );
        } catch {}
      };

    window.addEventListener(
      "voyage:search",
      handler
    );

    return () =>
      window.removeEventListener(
        "voyage:search",
        handler
      );
  }, [openCountry]);

  useEffect(() => {
    if (!mapElement.current) {
      return;
    }

    if (mapRef.current) {
      return;
    }

    const map = L.map(
      mapElement.current,
      {
        center:
          CONFIG.MAP_CENTER,

        zoom:
          CONFIG.INITIAL_ZOOM,

        minZoom:
          CONFIG.MIN_ZOOM,

        maxZoom:
          CONFIG.MAX_ZOOM,

        worldCopyJump: true,

        zoomControl: true,

        attributionControl: true,
      }
    );

    mapRef.current = map;

    const tiles =
      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 19,

          attribution:
            "&copy; OpenStreetMap contributors",

          updateWhenIdle: true,

          keepBuffer: 3,
        }
      );

    tiles.addTo(map);

    const ship =
      L.marker(
        CONFIG.MAP_CENTER,
        {
          icon:
            createShipIcon(),

          zIndexOffset: 1000,
        }
      ).addTo(map);

    shipRef.current = ship;

    async function loadCountries() {
      try {
        let response =
          await fetch(
            CONFIG.GEOJSON_URL,
            {
              cache: "no-store",
            }
          );

        if (!response.ok) {
          response =
            await fetch(
              CONFIG.GEOJSON_FALLBACK_URL,
              {
                cache:
                  "no-store",
              }
            );
        }

        const geojson =
          await response.json();

        const records =
          geojson.features
            .map(
              (feature: any) => {
                const props =
                  feature.properties ??
                  {};

                const name =
                  props.NAME ??
                  props.NAME_EN ??
                  props.ADMIN ??
                  props.name ??
                  "Unknown Land";

                return {
                  feature,
                  name,
                };
              }
            )
            .filter(
              (item: CountryRecord) =>
                item.name !==
                "Unknown Land"
            );

        countriesRef.current =
          records;

        setCountryCount(
          records.length
        );

        const countryLayer =
          L.geoJSON(
            geojson,
            {
              style:
                countryStyle(),

              onEachFeature: (
                feature,
                layer
              ) => {
                const props =
                  feature.properties ??
                  {};

                const country =
                  props.NAME ??
                  props.NAME_EN ??
                  props.ADMIN ??
                  props.name ??
                  "Unknown Land";

                layer.bindTooltip(
                  escapeHTML(
                    country
                  ),
                  {
                    sticky: true,

                    direction:
                      "top",

                    className:
                      "country-tooltip",
                  }
                );

                layer.on({
                  mouseover:
                    () => {
                      if (
                        selectedLayerRef.current !==
                        layer
                      ) {
                        (
                          layer as L.Path
                        ).setStyle(
                          hoverStyle()
                        );
                      }
                    },

                  mouseout:
                    () => {
                      if (
                        selectedLayerRef.current !==
                        layer
                      ) {
                        (
                          layer as L.Path
                        ).setStyle(
                          countryStyle()
                        );
                      }
                    },

                  click:
                    (
                      event: LeafletMouseEvent
                    ) => {
                      openCountry(
                        country,
                        layer,
                        event.latlng
                      );
                    },
                });
              },
            }
          ).addTo(map);

        countriesLayerRef.current =
          countryLayer;
      } catch (error) {
        console.error(
          "GeoJSON loading failed:",
          error
        );
      }
    }

    loadCountries();

    const resize =
      () => {
        requestAnimationFrame(
          () =>
            map.invalidateSize(
              true
            )
        );
      };

    window.addEventListener(
      "resize",
      resize
    );

    window.addEventListener(
      "orientationchange",
      resize
    );

    const observer =
      new ResizeObserver(
        resize
      );

    observer.observe(
      mapElement.current
    );

    gsap.fromTo(
      mapElement.current,
      {
        filter:
          "brightness(.35) sepia(1) blur(2px)",
        scale: 1.03,
      },
      {
        filter:
          "brightness(1) sepia(.55) blur(0px)",
        scale: 1,
        duration: 2.5,
        delay: 3,
        ease: "power3.out",
      }
    );

    const invalidateTimers = [
      100,
      500,
      1200,
    ].map((delay) =>
      window.setTimeout(
        resize,
        delay
      )
    );

    return () => {
      invalidateTimers.forEach(
        clearTimeout
      );

      observer.disconnect();

      window.removeEventListener(
        "resize",
        resize
      );

      window.removeEventListener(
        "orientationchange",
        resize
      );

      if (
        animationRef.current
      ) {
        cancelAnimationFrame(
          animationRef.current
        );
      }

      map.remove();

      mapRef.current = null;
    };
  }, [
    countryStyle,
    createShipIcon,
    escapeHTML,
    hoverStyle,
    openCountry,
  ]);

  function nextMedia() {
    if (
      discoveryMedia.length < 2
    ) {
      return;
    }

    setDiscoveryIndex(
      (index) =>
        (index + 1) %
        discoveryMedia.length
    );
  }

  function previousMedia() {
    if (
      discoveryMedia.length < 2
    ) {
      return;
    }

    setDiscoveryIndex(
      (index) =>
        (index -
          1 +
          discoveryMedia.length) %
        discoveryMedia.length
    );
  }

  return (
    <section
      className="map-shell"
      aria-label="World expedition map"
    >
      <div
        ref={mapElement}
        className="voyage-map"
      />

      <div className="map-vignette" />

      <div className="map-ink-overlay" />

      <MapHUD
        countries={countryCount}
        voyages={voyages}
        distance={distance}
      />

      <MapCompass />

      <CountryDiscovery
        country={selectedCountry}
        media={discoveryMedia}
        index={discoveryIndex}
        open={discoveryOpen}
        onClose={() =>
          setDiscoveryOpen(false)
        }
        onNext={nextMedia}
        onPrevious={
          previousMedia
        }
      />
    </section>
  );
}
