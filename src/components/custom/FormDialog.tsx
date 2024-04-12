import React, { useState, useCallback, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "react-feather";

interface FormDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Tag {
  id: number;
  name: string;
}

const Switch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => {
  const handleClick = () => {
    onChange(!checked);
  };

  return (
    <div
      className={`relative inline-block w-10 h-6 rounded-full transition-colors duration-200  focus:outline-none ${checked ? 'bg-green-500' : 'bg-gray-300'}`}
      onClick={handleClick}
      role="switch"
      aria-checked={checked}
    >
      <div
        className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full transition-transform duration-200 transform ${checked ? 'translate-x-full' : 'translate-x-0'}`}
      />
    </div>
  );
};

const FormDialog: React.FC<FormDialogProps> = ({ isOpen, onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [anonymousMode, setAnonymousMode] = useState(false);
  const [contentLength, setContentLength] = useState(0);
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch("http://localhost:3000/discussion/discussion/tags");
      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleUnselect = useCallback((tag: Tag) => {
    setSelectedTags((prev) => prev.filter((t) => t.id !== tag.id));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            setSelectedTags((prev) => {
              const newSelectedTags = [...prev];
              newSelectedTags.pop();
              return newSelectedTags;
            });
          }
        }
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    []
  );

  const selectables = tags.filter((tag) => !selectedTags.some((selectedTag) => selectedTag.id === tag.id));

  const handleSelectTag = (tag: Tag) => {
    setInputValue("");
    setSelectedTags((prev) => [...prev, tag]);
  };

  const handleToggleAnonymousMode = () => {
    setAnonymousMode((prev) => {
      console.log(!prev); // Log nilai baru setelah diubah
      return !prev;
    });
  };

  const handleContentChange = (content: string) => {
    // Menghitung jumlah karakter dari konten
    const text = content.replace(/<[^>]*>/g, "");
    if (text.length <= 500) {
      setContentLength(text.length);
    } else {
      // Menghapus karakter yang melebihi 500 jika ada
      const delta = text.length - 500;
      const quill = quillRef.current?.getEditor();
      if (quill) {
        quill.deleteText(500, delta);
      }
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-900 opacity-50" onClick={onClose}></div>
          <div className="bg-white p-6 rounded-lg shadow-xl z-10" style={{ maxWidth: "1000px", width: "90%", maxHeight: "100vh", overflowY: "auto" }}>
            <h2 className="text-lg font-bold mb-4">Buat Pertanyaan Baru</h2>
            <form>
              <div className="flex flex-col space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-3 ml-1">
                    Judul Pertanyaan
                  </label>
                  <Input id="title" type="text" />
                  <label htmlFor="title" className="block text-sm font-small text-gray-400 mt-1 ml-1" style={{ fontSize: "12px" }}>
                    Buat judul dengan spesifik sesuai dengan permasalahan Anda.
                  </label>
                </div>
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-3 ml-1">
                    Uraian Masalah
                  </label>
                  <ReactQuill
                    id="content"
                    onChange={handleContentChange}
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, 3, 4, 5, 6, false] }],
                        ["bold", "italic", "underline", "strike", "blockquote"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        [{ color: [] }, { background: [] }],
                        ["link", "image"],
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
                    ]}
                    ref={quillRef}
                  />
                  <label htmlFor="content" className="block text-sm font-small text-gray-400 mt-1 ml-1" style={{ fontSize: "12px" }}>
                    Uraikan pertanyaan anda disini. Anda juga dapat menambahkan kode, gambar dan lainnya untuk memperjelas pertanyaan. Min. 500 karakter. ({contentLength} / 500)
                  </label>
                </div>
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-3 ml-1">
                    Tags
                  </label>
                  <div className="relative mt-2">
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((tag) => (
                        <div
                          key={tag.id}
                          className="flex items-center bg-gray-200 rounded-md p-2"
                        >
                          <span>{tag.name}</span>
                          <button
                            className="ml-1 outline-none focus:ring-2 focus:ring-offset-2"
                            onClick={() => handleUnselect(tag)}
                          >
                            <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                          </button>
                        </div>
                      ))}
                      <input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Select tags..."
                        className="ml-2 bg-transparent outline-none placeholder-gray-500 flex-1 border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    {open && selectables.length > 0 && (
                      <div className="absolute w-full z-10 top-full rounded-md border bg-white shadow-md outline-none animate-in">
                        <div
                          className="p-2 space-y-2"
                          style={{ maxHeight: "200px", overflowY: "auto" }}
                        >
                          {selectables.map((tag) => (
                            <div
                              key={tag.id}
                              onClick={() => handleSelectTag(tag)}
                              className="cursor-pointer hover:bg-gray-100 rounded-md px-2 py-1"
                            >
                              {tag.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <label htmlFor="tags" className="block text-sm text-gray-400 mt-1 ml-1" style={{ fontSize: "12px" }}>
                    Tambahkan 5 atau lebih tags untuk mendeskripsikan tentang apa pertanyaan Anda. Pisahkan dengan koma (,).
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <Switch checked={anonymousMode} onChange={handleToggleAnonymousMode} />
                  <Label htmlFor="anonymous-mode">Anonymous Mode</Label>
                </div>
                <Button type="submit" className="bg-[#38B0AB] hover:bg-teal-700 text-gray-100 px-4 py-2 rounded-md">
                  Buat Pertanyaan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FormDialog;
