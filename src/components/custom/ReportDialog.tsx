import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface ReportDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

export function ReportDialog({isDialogOpen, setIsDialogOpen}: ReportDialogProps) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={isDialogOpen && setIsDialogOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Laporkan Masalah</DialogTitle>
          <DialogDescription>
            Apa Jenis Masalah yang Anda Laporkan?
          </DialogDescription>
        </DialogHeader>
          <ScrollArea className="h-[350px] w-[350px] rounded-md border p-4 bg-slate-50">
            <RadioGroup defaultValue="spam" >
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="spam" id="r1" />
                <div className="flex flex-col">
                  <Label htmlFor="r1">Spam</Label>
                  <p className="text-sm font-extralight">Akun palsu, penipuan keuangan, memposting tautan berbahaya, menyalahgunakan hastag, keterlibatan palsu, balasan berulang, posting ulang, atau direct message</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="privasi" id="r2" />
                <div className="flex flex-col">
                  <Label htmlFor="r2">Privasi</Label>
                  <p className="text-sm font-extralight">Membagikan informasi pribadi, mengancam akan membagikan/menyebarkan informasi pribadi, membagikan gambar intim tanpa persetujuan, membagikan gambar saya yang tidak saya kehendaki di platform ini</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="kebencian" id="r3" />
                <div className="flex flex-col">
                  <Label htmlFor="r3">Kebencian</Label>
                  <p className="text-sm font-extralight">Cercaan, stereotip rasis atau seksis, dehumanisasi, menyulut ketakutan atau diskriminasi, referensi kebencian, simbol & logo kebencian</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="penghinaan" id="r4" />
                <div className="flex flex-col">
                  <Label htmlFor="r4">Penghinaan & Pelecehan secara Online</Label>
                  <p className="text-sm font-extralight">Penghinaan, konten seksual yang tidak diinginkan & objektifikasi grafis, konten NSFW & grafis yang tidak diinginkan, penyangkalan peristiwa kekerasan, pelecehan bertarget dan memprovokasi pelecehan</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="kekerasan" id="r5" />
                <div className="flex flex-col">
                  <Label htmlFor="r5">Tutur Kekerasan</Label>
                  <p className="text-sm font-extralight">Ancaman kekerasan, berharap terjadinya celaka, mengagungkan kekerasan, penghasutan kekerasan, penghasutan kekerasan dengan kode</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="media-sensitif" id="r6" />
                <div className="flex flex-col">
                  <Label htmlFor="r6">Media yang sensitif atau mengganggu</Label>
                  <p className="text-sm font-extralight">Graphic content, gratutious gore, adult nudity & sexual behavior, violent sexual conduct, bestiality & necrophilia, media depicting a decreased individual</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bunuh-diri" id="r7" />
                <div className="flex flex-col">
                  <Label htmlFor="r7">Bunuh diri atau melukai diri sendiri</Label>
                  <p className="text-sm font-extralight">Mendorong, mempromosikan, memberikan intruksi, atau membagikan metode untuk melukai diri</p>
                </div>
              </div>
            </RadioGroup>
          </ScrollArea>
        <DialogFooter>
          <Button type="submit">Laporkan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}