// Nota per me futuro:
// questa tabella è pensata SOLO per l'admin.
// Mostra pochi campi "di controllo" + bottone Edit.

const AdminGameTable = ({ items, onEditClick }) => {
  if (!items || items.length === 0) {
    return <div className="text-white-50 small">Nessun gioco trovato. Prova a cambiare i filtri o crea un nuovo titolo.</div>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-dark table-sm align-middle lx-admin-table">
        <thead>
          <tr>
            <th style={{ width: "48px" }}></th>
            <th>Titolo</th>
            <th>Piattaforme</th>
            <th>Generi</th>
            <th className="text-center">Stato</th>
            <th className="text-end" style={{ width: "80px" }}>
              Azioni
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((g) => {
            // mi aspetto che l'API admin mi dia (almeno):
            // gameId, title, coverUrl, platform (string[]), genre (string[]), isDeleted (bool?)
            const platforms = g.platform || g.platforms || [];
            const genres = g.genre || g.genres || [];
            const isDeleted = g.isDeleted ?? false;

            return (
              <tr key={g.gameId}>
                <td>
                  {g.coverUrl ? (
                    <img
                      src={g.coverUrl}
                      alt={g.title}
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 4,
                        backgroundColor: "#222",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                      }}
                    >
                      <i className="bi bi-image text-secondary" />
                    </div>
                  )}
                </td>
                <td>
                  <div className="fw-semibold">{g.title}</div>
                </td>
                <td>
                  <div className="small text-white-50">{platforms.length ? platforms.join(", ") : "Nessuna piattaforma"}</div>
                </td>
                <td>
                  <div className="small text-white-50">{genres.length ? genres.join(", ") : "Nessun genere"}</div>
                </td>
                <td className="text-center">
                  {isDeleted ? <span className="badge bg-secondary">Nascosto</span> : <span className="badge bg-success">Pubblicato</span>}
                </td>
                <td className="text-end">
                  <button type="button" className="btn btn-sm lx-btn-outline" onClick={() => onEditClick(g.gameId)}>
                    <i className="bi bi-pencil-square" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminGameTable;
