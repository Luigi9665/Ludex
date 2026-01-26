import { useToast } from "./ToastProvider";

const LxToastBar = () => {
  const { toasts } = useToast();

  if (!toasts.length) return null;

  const last = toasts[toasts.length - 1];

  return (
    <div className="lx-toast-wrapper">
      <div className={`lx-toast-bar lx-toast-bar--${last.type}`}>{last.message}</div>
    </div>
  );
};

export default LxToastBar;
