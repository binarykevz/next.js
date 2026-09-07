"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Search, RotateCcw, ScrollText } from "lucide-react";

export default function VoyageControls() {
  const [search, setSearch] = useState("");

  useEffect(() => {
    function handler(event: KeyboardEvent) {
      const element =
        document.activeElement;

      const tag =
        element?.tagName;

      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT"
      ) {
        return;
      }

      if (event.key === "/") {
        event.preventDefault();

        document
          .getElementById(
            "country-search"
          )
          ?.focus();
      }
    }

    window.addEventListener(
      "keydown",
      handler
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handler
      );
  }, []);

  function submitSearch() {
    window.dispatchEvent(
      new CustomEvent(
        "voyage:search",
        {
          detail: search,
        }
      )
    );
  }

  function reset() {
    window.dispatchEvent(
      new Event("voyage:reset")
    );
  }

  function journal() {
    document
      .getElementById("journal")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  return (
    <motion.section
      className="control-panel"
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 3.15,
        duration: 0.8,
      }}
    >
      <div className="search-wrap">
        <Search size={20} />

        <input
          id="country-search"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          onKeyDown={(event) => {
            if (
              event.key === "Enter"
            ) {
              submitSearch();
            }

            if (
              event.key === "Escape"
            ) {
              setSearch("");
            }
          }}
          autoComplete="off"
          spellCheck={false}
          placeholder="Search a kingdom, nation or distant land..."
          aria-label="Search country"
        />
      </div>

      <button
        className="ancient-button"
        onClick={reset}
      >
        <RotateCcw size={15} />
        Reset Voyage
      </button>

      <button
        className="ancient-button"
        onClick={journal}
      >
        <ScrollText size={15} />
        Expedition Journal
      </button>
    </motion.section>
  );
}
