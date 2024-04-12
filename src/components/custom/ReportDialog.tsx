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
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"

export function ReportDialog() {
  return (
    <Dialog>
      <DialogTrigger>
            <Button variant="ghost" className="flex">
                <DropdownMenuItem className="font-light text-lg">
                <svg
                    width="23"
                    height="23"
                    viewBox="0 0 23 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                    d="M13.0116 21.702L12.0424 22.0799C11.6928 22.211 11.3076 22.211 10.9581 22.0799L9.98878 21.702C7.53366 20.7395 5.42486 19.0606 3.93649 16.8838C2.44812 14.7069 1.64903 12.1326 1.64307 9.49558V4.92843C3.50359 5.19359 5.40118 4.95204 7.13596 4.22922C8.87072 3.50641 10.3784 2.32909 11.5002 0.821289C13.5538 3.81129 16.9545 5.22415 21.3574 4.92843V9.49558C21.3514 12.1326 20.5524 14.7069 19.0639 16.8838C17.5755 19.0606 15.4668 20.7395 13.0116 21.702Z"
                    stroke="black"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    />
                </svg>
                <span className="ml-2">Laporkan</span>
                </DropdownMenuItem>
            </Button>
      </DialogTrigger>
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