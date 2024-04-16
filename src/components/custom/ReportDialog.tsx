import { useState, useEffect } from "react";
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface ReportDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  id: number;
  path: string;
}

interface ReportType{
  value: string;
  label: string;
  description: string;
}

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

// Skema form
const formSchema = z.object({
  type: z.enum(["", ...reportTypes.map(reportType => reportType.value)])
});

function ReportDialog({
  isDialogOpen, 
  setIsDialogOpen, 
  id,
  path
}: ReportDialogProps) {
  // const [commentData, setCommentData] = useState<any>(null);
  const [userId, setUserId] = useState<string>('null');
  const [threadId, setThreadId] = useState<number>(null); 
  const [commentId, setCommentId] = useState<number>(null); 
  const [commentReplyId, setCommentReplyId] =  useState<number>(null); 

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: reportTypes[0].value,
    },
  });

  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/discussion${path}/${id}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch comment data');
      }
      const data = await response.json();

      if (path === "") {
        setThreadId(data.id);
        setUserId(data.user_id);
      } else if (path === "/comment") {
        setCommentId(data.id);
        setThreadId(data.thread_id);
        setUserId(data.user_id);  
      } else if (path === "/comment-reply") {
        setCommentReplyId(data.id);
        setCommentId(data.comment_id);
        setUserId(data.user_id); 
      }
      
    } catch (error) {
      console.error('Error fetching comment data:', error);
    }
  };


  const handleReportSubmit = async () => {
    try {
      
      const reportData = {
        user_id: userId, 
        thread_id: threadId, 
        comment_id: commentId, 
        comment_reply_id: commentReplyId,
        report_type: formSchema.parse({ type: form.watch('type') }).type,
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

      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error reporting:', error);
    }
  };

  // Mengambil data komentar saat dialog dibuka
  useEffect(() => {
    if (isDialogOpen) {
      fetchData();
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleReportSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          {reportTypes.map((reportType) => (
                            <FormItem key={reportType.value} className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={reportType.value} />
                              </FormControl>
                              <div>
                                <FormLabel>{reportType.label}</FormLabel>
                                <FormDescription>{reportType.description}</FormDescription>
                              </div>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="bg-[#38B0AB] hover:bg-teal-700 fixed bottom-4 right-[25px]">Laporkan</Button>
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter className="h-8">
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default ReportDialog;

