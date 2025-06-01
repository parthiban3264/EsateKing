import { useEffect, useRef } from 'react';

const UploadWidget = ({ uwConfig, setPublicId, setStatus }) => {
  const uploadWidgetRef = useRef(null);
  const uploadButtonRef = useRef(null);

  useEffect(() => {
    if (!window.cloudinary || !uploadButtonRef.current) return;

    const widget = window.cloudinary.createUploadWidget(
      uwConfig,
      (error, result) => {
        if (!error && result && result.event === 'success') {
          console.log('Upload successful:', result.info);

          // ✅ Safe check before calling
          if (typeof setPublicId === 'function') {
            setPublicId(result.info.public_id);
          }

          if (typeof setStatus === 'function') {
            setStatus(prev => [...prev, result.info.secure_url]);
          }
        } else if (error) {
          console.error('Upload Error:', error);
        }
      }
    );

    uploadWidgetRef.current = widget;

    const handleClick = () => {
      widget.open();
    };

    const button = uploadButtonRef.current;
    button.addEventListener('click', handleClick);

    return () => {
      button.removeEventListener('click', handleClick);
    };
  }, [uwConfig, setPublicId, setStatus]);

  return (
    <button
      ref={uploadButtonRef}
      id="upload_widget"
      className="cloudinary-button"
      type="button"
    >
      Upload
    </button>
  );
};

export default UploadWidget;
