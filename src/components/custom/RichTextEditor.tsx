import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  descriptionText?: string;
  containerWidth?: string; // Tambahkan prop containerWidth
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, descriptionText = "Uraikan pertanyaan anda disini. Anda juga dapat menambahkan kode, gambar dan lainnya untuk memperjelas pertanyaan. Min. 500 karakter.", containerWidth = "100%" }) => {
  const quillRef = useRef<ReactQuill>(null);
  const [contentLength, setContentLength] = useState(0);

  const handleContentChange = (content: string) => {
    const text = content.replace(/(<([^>]+)>)/gi, "");
    setContentLength(text.length);
    onChange(content);

    if (text.length >= 500) {
      const quill = quillRef.current;
      if (quill) {
        quill.blur();
      }
    }
  };

  return (
    <div style={{ maxWidth: `calc(${containerWidth} - 3.5vw)` }}> 
      <ReactQuill
        className="z-index: 9999"
        value={value}
        onChange={handleContentChange}
        modules={{
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ color: [] }, { background: [] }],
            ["link", "image", "video"],
            ["code-block"],
            ["clean"],
          ],
        }}
        formats={[
          "header",
          "bold",
          "italic",
          "underline",
          "strike",
          "blockquote",
          "list",
          "bullet",
          "indent",
          "link",
          "image",
          "color",
          "background",
          "code-block",
          "video",
        ]}
        ref={quillRef}
        readOnly={contentLength >= 500}
        
      />
      <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
        {descriptionText} ({contentLength} / 500)
      </p>
    </div>
  );
};

export default RichTextEditor;
