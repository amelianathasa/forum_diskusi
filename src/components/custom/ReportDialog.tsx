import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface ReportDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  commentId: number;
}

interface ReportType{
  value: string;
  label: string;
  description: string;
}

const ReportDialog =({
  isDialogOpen, 
  setIsDialogOpen,
  commentId 
   }: ReportDialogProps,
  ) => {
  const [commentData, setCommentData] = useState(null); // State untuk menyimpan data komentar
  const [selectedReportType, setSelectedReportType] = useState("spam");
  const [userId, setUserId] = useState<string>("");
  const [threadId, setThreadId] = useState<number>(0);

  const fetchCommentData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/discussion/comment/${commentId}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch comment data');
        }
      const data = await response.json();
      setCommentData(data); // Set data komentar ke state
      setUserId(data.user_id); // Set user_id ke state
      setThreadId(data.thread_id); // Set thread_id ke state
      console.log('Fetched comment data:', data); // Mencetak data komentar ke konsol
    } catch (error) {
      console.error('Error fetching comment data:', error);
    }
  };

  const handleReportTypeChange = (value: string) => {
    setSelectedReportType(value);
  };

  const handleReportSubmit = async () => {
    try {
      const reportData = {
        user_id: userId,
        thread_id: threadId,
        comment_id: commentId,
        report_type: selectedReportType,
        created_at: new Date().toISOString(),
        status_review: false
      };
  
      const response = await fetch('http://localhost:3000/discussion/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reportData)
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      console.log('Report data successfully submitted:', reportData); 

      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error reporting:', error);
    }
  };
  

  const reportTypes: ReportType[] = [
    {
      value: "spam",
      label: "Spam",
      description: "Akun palsu, penipuan keuangan, memposting tautan berbahaya, menyalahgunakan hastag, keterlibatan palsu, balasan berulang, posting ulang, atau direct message"
    },
    {
      value: "privasi",
      label: "Privasi",
      description: "Membagikan informasi pribadi, mengancam akan membagikan/menyebarkan informasi pribadi, membagikan gambar intim tanpa persetujuan, membagikan gambar saya yang tidak saya kehendaki di platform ini"
    },
    {
      value: "kebencian",
      label: "Kebencian",
      description: "Cercaan, stereotip rasis atau seksis, dehumanisasi, menyulut ketakutan atau diskriminasi, referensi kebencian, simbol & logo kebencian"
    },
    {
      value: "penghinaan",
      label: "Penghinaan & Pelecehan secara Online",
      description: "Penghinaan, konten seksual yang tidak diinginkan & objektifikasi grafis, konten NSFW & grafis yang tidak diinginkan, penyangkalan peristiwa kekerasan, pelecehan bertarget dan memprovokasi pelecehan"
    },
    {
      value: "kekerasan",
      label: "Tutur Kekerasan",
      description: "Ancaman kekerasan, berharap terjadinya celaka, mengagungkan kekerasan, penghasutan kekerasan, penghasutan kekerasan dengan kode"
    },
    {
      value: "media-sensitif",
      label: "Media yang sensitif atau mengganggu",
      description: "Graphic content, gratutious gore, adult nudity & sexual behavior, violent sexual conduct, bestiality & necrophilia, media depicting a decreased individual"
    },
    {
      value: "bunuh-diri",
      label: "Bunuh diri atau melukai diri sendiri",
      description: "Mendorong, mempromosikan, memberikan intruksi, atau membagikan metode untuk melukai diri"
    }
  ];

  // Mengambil data komentar saat dialog dibuka
  useEffect(() => {
    if (isDialogOpen) {
      fetchCommentData();
    }
  }, [isDialogOpen]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Laporkan Masalah</DialogTitle>
          <DialogDescription>
            Apa Jenis Masalah yang Anda Laporkan?
          </DialogDescription>
        </DialogHeader>
          <ScrollArea className="h-[350px] w-[350px] rounded-md border p-4 bg-slate-50">
          <RadioGroup>
            <div className="flex flex-col space-y-4">
              {reportTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={type.value} 
                    id={`r${type.value}`}
                    checked={selectedReportType === type.value}
                    onChange={() => handleReportTypeChange(type.value)}
                  />
                  <div className="flex flex-col">
                    <Label htmlFor={`r${type.value}`}>{type.label}</Label>
                    <p className="text-sm font-extralight">{type.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
          </ScrollArea>
        <DialogFooter>
          <Button type="submit" onClick={handleReportSubmit} className="bg-[#38B0AB] hover:bg-teal-700">Laporkan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default ReportDialog;