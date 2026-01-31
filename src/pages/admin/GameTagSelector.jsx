import React, { useMemo, useState } from "react";

/**
 * Step 3 – Selettore tag avanzato
 *
 * Props:
 * - tags: [{ id, displayName, category, description?, displayOrder }]
 * - selectedTagIds: number[]
 * - onChange(ids: number[])
 */
const GameTagSelector = ({ tags, selectedTagIds, onChange }) => {
  const [searchText, setSearchText] = useState("");
  const [activeCategory, setActiveCategory] = useState("GENRE");

  const categories = useMemo(() => [...new Set(tags.map((t) => t.category))].sort((a, b) => String(a).localeCompare(String(b))), [tags]);

  const filteredTags = useMemo(() => {
    let result = tags;

    if (searchText.trim() !== "") {
      const q = searchText.toLowerCase();

      result = result.filter((t) => {
        const code = t.code?.toLowerCase() ?? "";
        const name = t.displayName?.toLowerCase() ?? ""; // opzionale / backward compat
        const category = String(t.category ?? "").toLowerCase();

        return code.includes(q) || name.includes(q) || category.includes(q);
      });
    } else {
      result = result.filter((t) => t.category === activeCategory);
    }

    return [...result].sort((a, b) => {
      if (a.displayOrder !== b.displayOrder) {
        return a.displayOrder - b.displayOrder;
      }
      return a.code.localeCompare(b.code); // 👈 ordina per code invece di displayName
    });
  }, [tags, searchText, activeCategory]);

  const selectedTags = useMemo(() => tags.filter((t) => selectedTagIds.includes(t.id)), [tags, selectedTagIds]);

  const selectedCountByCategory = (category) => tags.filter((t) => t.category === category && selectedTagIds.includes(t.id)).length;

  const toggleTag = (id) => {
    if (selectedTagIds.includes(id)) {
      onChange(selectedTagIds.filter((x) => x !== id));
    } else {
      onChange([...selectedTagIds, id]);
    }
  };

  const removeTag = (id) => {
    onChange(selectedTagIds.filter((x) => x !== id));
  };

  return (
    <div className="lx-section lx-glass p-4">
      <h5 className="mb-3">
        <i className="bi bi-tags me-2" />
        Tag del gioco
      </h5>

      {/* Tag selezionati */}
      <div className="lx-tag-selected-bar mb-3">
        <label className="form-label mb-2">
          <i className="bi bi-bookmark-check me-1" />
          Tag selezionati ({selectedTags.length})
        </label>

        {selectedTags.length === 0 ? (
          <div className="lx-tag-empty">
            <small className="text-white-50">
              <i className="bi bi-info-circle me-1" />
              Nessun tag selezionato. Consigliato: 5–10 tag significativi.
            </small>
          </div>
        ) : (
          <div className="lx-tag-pill-container">
            {selectedTags.map((t) => (
              <div key={t.id} className="lx-tag-pill lx-tag-selected">
                <span>{t.code}</span>
                <button type="button" className="lx-tag-remove" onClick={() => removeTag(t.id)} aria-label={`Rimuovi ${t.code}`}>
                  <i className="bi bi-x" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search */}
      <div className="mb-3">
        <div className="lx-search-bar">
          <i className="bi bi-search lx-search-icon" />
          <input
            className="form-control lx-search-input"
            placeholder="Cerca per nome o categoria..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {searchText && (
            <button type="button" className="lx-search-clear" onClick={() => setSearchText("")} aria-label="Cancella ricerca">
              <i className="bi bi-x-circle" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs categoria */}
      {!searchText && (
        <div className="lx-tag-category-tabs mb-3">
          <div className="lx-tabs-container">
            {categories.map((cat) => {
              const count = selectedCountByCategory(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  className={`lx-tab-item ${activeCategory === cat ? "lx-tab-active" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                  {count > 0 && <span className="lx-tab-badge">{count}</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Lista tag */}
      {searchText && (
        <small className="text-white-50 d-block mb-2">
          <i className="bi bi-funnel me-1" />
          {filteredTags.length} risultati per "{searchText}"
        </small>
      )}

      <div className="lx-tag-list-container">
        {filteredTags.length === 0 ? (
          <div className="lx-tag-empty-state">
            <i className="bi bi-inbox" style={{ fontSize: "2rem" }} />
            <p className="mt-2 mb-0 text-muted">{searchText ? "Nessun tag trovato" : "Nessun tag in questa categoria"}</p>
          </div>
        ) : (
          <div className="lx-tag-grid">
            {filteredTags.map((t) => {
              const selected = selectedTagIds.includes(t.id);
              return (
                <div
                  key={t.id}
                  className={`lx-tag-chip ${selected ? "lx-tag-chip-selected" : ""}`}
                  role="checkbox"
                  aria-checked={selected}
                  tabIndex={0}
                  title={t.description || t.code}
                  onClick={() => toggleTag(t.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleTag(t.id);
                    }
                  }}
                >
                  <span className="lx-tag-name">{t.code}</span>
                  {selected && <i className="bi bi-check-lg lx-tag-check" />}
                  {t.description && <div className="lx-tag-tooltip">{t.description}</div>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <small className="text-white-50 d-block mt-3">
        <i className="bi bi-lightbulb me-1" />
        Usa i tag per guidare il questionario &quot;Trova il gioco giusto&quot;.
      </small>
    </div>
  );
};

export default GameTagSelector;
