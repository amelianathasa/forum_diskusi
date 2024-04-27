import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Switch from "./Switch";
import RichTextEditor from "./RichTextEditor";

interface FormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void; // Tambahkan prop onSubmit
}

const FormDialog: React.FC<FormDialogProps> = ({ isOpen, onClose, onSubmit }) => {
  const [anonymousMode, setAnonymousMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
    user_id: "user1011",
    author: "Adilla",
  });

  const { toast } = useToast();
  const [dialogWidth, setDialogWidth] = useState("70vw");
  const [titleError, setTitleError] = useState(false);
  const [contentError, setContentError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setTitleError(true);
    } else {
      setTitleError(false);
    }

    const isEmptyContent = formData.content.trim() === "" || formData.content.trim() === "<p><br></p>";

    if (isEmptyContent) {
      setContentError(true);
    } else {
      setContentError(false);
    }

    // Create the new thread
    const tags = formData.tags.trim() ? formData.tags.split(",").map((tag) => tag.trim()) : [];

    if (formData.title.trim() && !isEmptyContent) {
      try {
        const response = await fetch("http://localhost:3000/discussion/thread", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            content: formData.content,
            anonymous: anonymousMode,
            tags: tags, // Send tag IDs to the backend
            user_id: formData.user_id,
            author: formData.author,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create thread");
        }

        onSubmit(); // Panggil prop onSubmit untuk menutup dialog
        onClose(); // Close the dialog after successfully creating the thread
      } catch (error) {
        console.error("Error creating thread:", error);
        alert("Failed to create thread. Please try again.");
      }
    }
  };
  
  return isOpen ? (
    <Dialog open={isOpen} onOpenChange={onClose} onResize={(width) => setDialogWidth(`${width}px`)}>
      <DialogContent className="overflow-y-auto max-h-screen" style={{ maxWidth: dialogWidth }}>
        <DialogTitle className="block text-lg font-medium text-gray-700">
          Buat Pertanyaan Baru
        </DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Judul Pertanyaan
            </Label>
            <Input id="title" type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            <p className="text-xs text-gray-500 mt-1">Buat judul dengan spesifik sesuai dengan permasalahan Anda.</p>
            {titleError && <p className="text-xs text-red-500 mt-1">Judul pertanyaan harus diisi!</p>}
          </div>
          <div>
            <Label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Uraian Pertanyaan
            </Label>
            <div className="z-40">
              <RichTextEditor
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
                placeholder=""
                descriptionText="Uraikan pertanyaan anda disini. Anda juga dapat menambahkan kode, gambar dan lainnya untuk memperjelas pertanyaan. Min. 500 karakter."
                containerWidth={dialogWidth}
              />
            </div>
            {contentError && <p className="text-xs text-red-500 mt-1">Uraian pertanyaan harus diisi!</p>}
          </div>
          <div>
            <Label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tags (Opsional)
            </Label>
            <Input
              id="tags"
              type="text"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
            />
            <p className="text-xs text-gray-500 mt-1">Tambahkan tags untuk mendeskripsikan tentang apa pertanyaan Anda. (Tags dapat lebih dari satu, pisahkan dengan koma) </p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <Switch checked={anonymousMode} onChange={setAnonymousMode} />
              <Label htmlFor="anonymous-mode" className="ml-2 cursor-pointer">Anonymous Mode</Label>
            </div>
            <Button type="submit" className={`bg-[#38B0AB] hover:bg-teal-700 text-gray-100 px-4 py-2 rounded-md`} variant="outline"
     >
              Buat Pertanyaan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  ) : null;
};

export default FormDialog;
