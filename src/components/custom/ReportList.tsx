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

// Interface untuk props laporan
interface ReportProps {
  id: string;
  userId: string;
  commentId: number | null;
  threadId: number | null;
  commentReplyId: number | null;
  reportType: string;
  createdAt: string;
  statusReview: boolean;
}

function ReportList() {
  // State untuk menyimpan daftar laporan
  const [reports, setReports] = useState<ReportProps[]>([]);

  // Fungsi untuk mengambil data laporan dari server
  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/discussion/report/data`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }
      const data = await response.json();

      const adjustedData = data.map((report: any) => ({
        ...report,
        id: report.id,
        userId: report.user_id,
        threadId: report.thread_id,
        commentId: report.comment_id,
        commentReplyId: report.comment_reply_id,
        reportType: report.report_type,
        createdAt: report.created_at,
        statusReview: report.status_review, 
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
          <TableHead className="text-center">Report Id</TableHead>
          <TableHead className="text-center">User Id</TableHead>
          <TableHead className="text-center">Thread Id</TableHead>
          <TableHead className="text-center">Comment Id</TableHead>
          <TableHead className="text-center">Comment Reply Id</TableHead>
          <TableHead className="text-center">Report Type</TableHead>
          <TableHead className="text-center">Created At</TableHead>
          <TableHead className="text-center">Status Review</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
      {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>{report.id}</TableCell>
              <TableCell>{report.userId}</TableCell>
              <TableCell>{report.threadId}</TableCell>
              <TableCell>{report.commentId}</TableCell>
              <TableCell>{report.commentReplyId}</TableCell>
              <TableCell>{report.reportType}</TableCell>
              <TableCell>{report.createdAt}</TableCell>
              <TableCell>{report.statusReview ? "Review Completed" : "Not Reviewed"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </>
  );
}

export default ReportList;
