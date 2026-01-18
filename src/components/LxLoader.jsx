const LxLoader = ({ message = "Caricamento in corso..." }) => {
  return (
    <div className="lx-loader-wrapper">
      <div className="lx-loader-orbit">
        <div className="lx-loader-core">
          <span className="lx-loader-dot" />
          <span className="lx-loader-dot" />
          <span className="lx-loader-dot" />
        </div>
      </div>
      <p className="lx-loader-text">{message}</p>
    </div>
  );
};

export default LxLoader;
