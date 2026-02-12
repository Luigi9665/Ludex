import { useEffect, useState } from "react";

const Username = ({ userName, setUserName, baseUrl, setUsernameAvailableParent, userNameServerErrorParent }) => {
  const [isUsernameTouched, setIsUsernameTouched] = useState(false);
  const [isUsernameAvailable, setUsernameAvailable] = useState(null); // null | true | false
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [userNameServerError, setUsernameServerError] = useState(userNameServerErrorParent);

  const showUsernameTakenError = isUsernameTouched && isUsernameAvailable === false;

  const checkUsernameAvailable = async () => {
    const value = userName.trim();

    if (!value) {
      setUsernameAvailable(null);
      setUsernameServerError("");
      return;
    }

    const URL = `${baseUrl}/api/Auth/checkUsername?username=${encodeURIComponent(value)}`;

    setCheckingUsername(true);
    setUsernameServerError("");

    try {
      const response = await fetch(URL);
      if (response.ok) {
        const dataobj = await response.json();
        setUsernameAvailable(dataobj.available);
      } else {
        throw new Error("Errore nel controllo username");
      }
    } catch (error) {
      console.error(error);
      setUsernameServerError("Errore nel controllo dell'username, riprova più tardi");
      setUsernameAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  };

  // Comunico al parent solo un booleano pulito: true se disponibile, false altrimenti
  useEffect(() => {
    setUsernameAvailableParent(!!isUsernameAvailable);
  }, [isUsernameAvailable, setUsernameAvailableParent]);

  return (
    <>
      <input
        className={`lx-auth-input ${showUsernameTakenError ? "lx-auth-input--error" : ""}`}
        placeholder="mariorossi"
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

      {showUsernameTakenError && (
        <div className="lx-auth-error">
          <i className="bi bi-x-circle" /> Username già in uso
        </div>
      )}

      {userNameServerError && (
        <div className="lx-auth-error">
          <i className="bi bi-exclamation-triangle" /> {userNameServerError}
        </div>
      )}

      {checkingUsername && (
        <div className="lx-auth-hint">
          <span className="lx-auth-spinner-sm" /> Controllo disponibilità...
        </div>
      )}

      {isUsernameAvailable === true && !userNameServerError && (
        <div className="lx-auth-hint lx-auth-hint--success">
          <i className="bi bi-check-circle" /> Username disponibile
        </div>
      )}
    </>
  );
};

export default Username;
