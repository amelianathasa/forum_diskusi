import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import parse from "html-react-parser";

// Interface untuk props laporan
interface ReportProps {
  id: string;
  author: string;
  content: string;
  reportType: string;
}

function ReportList() {
  // State untuk menyimpan daftar laporan
  const [reports, setReports] = useState<ReportProps[]>([]);

  // Fungsi untuk mengambil data laporan dari server
  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/discussion/report/list`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }
      const data = await response.json();

      const adjustedData = data.map((report: any) => ({
        ...report,
        author: report.author,
        content: report.content,
        reportType: report.report_type,
      }));
      setReports(adjustedData);
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  // Mengambil data laporan saat komponen pertama kali dimuat
  useEffect(() => {
    fetchData();
  }, []); // Efek samping hanya dijalankan sekali saat komponen dimuat

  return (
    <>
    <Table>
      <TableCaption>List Report</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Author</TableHead>
          <TableHead>Content</TableHead>
          <TableHead>Report Type</TableHead>
          <TableHead>Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
      {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>{report.author}</TableCell>
              <TableCell>{parse(report.content)}</TableCell>
              <TableCell>{report.reportType}</TableCell>
              <TableCell>
                <Button className="bg-red-500 hover:bg-red-700">Delete</Button>
                </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </>
  );
}

export default ReportList;
