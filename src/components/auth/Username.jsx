import { useEffect, useState } from "react";

const Username = ({ userName, setUserName, baseUrl, setUsernameAvailableParent, userNameServerErrorParent }) => {
  const [isUsernameTouched, setIsUsernameTouched] = useState(false);
  const [isUsernameAvailable, setUsernameAvailable] = useState(null);
  const [checkinUsername, setCheckinUsername] = useState(false);
  const [userNameServerError, setUsernameServerError] = useState(userNameServerErrorParent);

  const showUsernameTakenError = isUsernameTouched && isUsernameAvailable === false;

  const checkUsernameAvailable = async () => {
    const value = userName.trim();
    if (!value) {
      setUsernameAvailable(null);
      return;
    }

    const URL = `${baseUrl}/api/Auth/checkUsername?username=${value}`;

    setCheckinUsername(true);
    setUsernameServerError("");

    try {
      const response = await fetch(URL);

      if (response.ok) {
        const dataobj = await response.json();
        setUsernameAvailable(dataobj.available);
      } else if (response.status === 404) {
        throw new Error("Risorsa non trovata (404). Riprova con la ricerca.");
      } else if (response.status >= 500) {
        throw new Error("Errore del server, riprova più tardi.");
      } else {
        throw new Error("Errore nella richiesta: " + response.status);
      }
    } catch (error) {
      console.log(error);
      setUsernameServerError("Errore nel controllo dell'Username, riprova più tardi");
    } finally {
      setCheckinUsername(false);
    }
  };

  useEffect(() => {
    setUsernameAvailableParent(isUsernameAvailable);
  }, [isUsernameAvailable]);

  return (
    <div>
      <label className="form-label">Username</label>
      <input
        className={`form-control ${showUsernameTakenError ? "is-invalid" : ""}`}
        placeholder="Mariorossi1!"
        type="text"
        value={userName}
        onChange={(e) => {
          setUserName(e.target.value);
          setUsernameAvailable(null);
          setUsernameServerError("");
        }}
        onBlur={() => {
          setIsUsernameTouched(true);
          checkUsernameAvailable();
        }}
        required
        maxLength={32}
      />
      {showUsernameTakenError && <div className="invalid-feedback">Username già in uso.</div>}

      {userNameServerError && <div className="text-warning small mt-1">{userNameServerError}</div>}

      {checkinUsername && <div className="text-muted small mt-1">Controllo username in corso...</div>}
    </div>
  );
};

export default Username;
