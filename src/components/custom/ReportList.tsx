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
import { getAuthenticatedUser } from "@/lib/getAuthenticatedUser";

import parse from "html-react-parser";

// Interface untuk props laporan
interface ReportProps {
  id: number;
  thread_id : number;
  comment_id: number;
  comment_reply_id: number;
  report_type: string;
  author: string;
  content: string;
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
        id: report.id,
        thread_id: report.thread_id,
        comment_id: report.comment_id,
        comment_reply_id: report.comment_reply_id,
        report_type: report.report_type,
        content: report.content,
        author: report.author,
      }));
      setReports(adjustedData);
      console.log('Report data fetched:', data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  const handleDelete = async (threadId: number, commentId: number, commentReplyId: number) => {
    try {
      let path = "";
      let id = null;

    if (commentReplyId !== null) {
      path = "/comment-reply";
      id = commentReplyId;
    } else if (commentId !== null) {
      path = "/comment";
      id = commentId;
    } else if (threadId !== null) {
     path="";
     id = threadId 
    }
  
      const response = await fetch(
        `http://localhost:3000/discussion${path}/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: getAuthenticatedUser().userId,
            isAdmin: getAuthenticatedUser().administrator,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Report successfully deleted:", data);
    } catch (error) {
      console.error("Error deleting comment:", error);
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
          <TableHead>Content Reported</TableHead>
          <TableHead>Report Type</TableHead>
          <TableHead>Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
      {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>{report.author}</TableCell>
              <TableCell>{parse(report.content)}</TableCell>
              <TableCell>{report.report_type}</TableCell>
              <TableCell>
              <Button className="bg-red-500 hover:bg-red-700" onClick={() => handleDelete(report.thread_id, report.comment_id, report.comment_reply_id)}>Delete</Button>
              </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </>
  );
}

export default ReportList;
