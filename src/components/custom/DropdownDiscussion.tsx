import React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { getAuthenticatedUser } from "@/lib/getAuthenticatedUser";
import { useDiscussion } from "@/DiscussionContext";
import ReportDialog from "./ReportDialog";

interface DropdownDiscussionProps {
  user_id: string;
  showVerify: boolean;
  commentId?: number;
  setIsVerified?: (verified: boolean) => void;
  isVerified?: boolean;
  path: string;
  id: number;
}

const DropdownDiscussion = ({
  user_id,
  showVerify,
  commentId,
  setIsVerified,
  isVerified,
  path,
  id,
}: DropdownDiscussionProps) => {
  const isAdmin = getAuthenticatedUser().administrator;
  const username = getAuthenticatedUser().username;

  const [isReportDialogOpen, setIsReportDialogOpen] = React.useState(false);
  const { discussions, fetchDiscussionList } = useDiscussion();

  const handleVerify = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/discussion/comment/${commentId}/verify`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isAdmin: getAuthenticatedUser().administrator,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setIsVerified(data.verified);
      console.log(data);
    } catch (error) {
      console.error("Error verifying comment:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/discussion${path}/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: getAuthenticatedUser().username,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      fetchDiscussionList();
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <svg
              width="4"
              height="15"
              viewBox="0 0 4 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 5.7059C1.73736 5.7059 1.47728 5.75231 1.23463 5.84247C0.991982 5.93263 0.771504 6.06478 0.585787 6.23138C0.40007 6.39798 0.25275 6.59576 0.152241 6.81343C0.0517316 7.0311 2.06817e-07 7.2644 2.06817e-07 7.5C2.06817e-07 7.7356 0.0517316 7.9689 0.152241 8.18657C0.25275 8.40424 0.40007 8.60202 0.585787 8.76862C0.771504 8.93522 0.991982 9.06737 1.23463 9.15753C1.47728 9.24769 1.73736 9.2941 2 9.2941C2.53043 9.29399 3.03909 9.10487 3.41408 8.76833C3.78907 8.4318 3.99967 7.97542 3.99955 7.49959C3.99943 7.02377 3.7886 6.56748 3.41344 6.23109C3.03828 5.89471 2.53043 5.70579 2 5.7059ZM2 3.58657C2.26253 3.58646 2.52246 3.53997 2.76495 3.44975C3.00745 3.35953 3.22776 3.22735 3.41331 3.06075C3.59885 2.89415 3.74601 2.6964 3.84636 2.47879C3.94671 2.26118 3.9983 2.02797 3.99818 1.79247C3.99806 1.55697 3.94624 1.3238 3.84566 1.10627C3.74509 0.88874 3.59774 0.69111 3.41202 0.524664C3.2263 0.358218 3.00586 0.226216 2.76327 0.136194C2.52068 0.0461718 2.26071 -0.000106859 1.99818 1.85274e-07C1.46799 0.000216378 0.95961 0.189358 0.584878 0.525817C0.210146 0.862276 -0.00024079 1.31849 2.06817e-07 1.7941C0.000241203 2.26971 0.21109 2.72575 0.586163 3.0619C0.961236 3.39806 1.46981 3.58678 2 3.58657ZM2 11.4118C1.46957 11.4118 0.96086 11.6008 0.585787 11.9373C0.210714 12.2737 2.06817e-07 12.7301 2.06817e-07 13.2059C2.06817e-07 13.6817 0.210714 14.1381 0.585787 14.4745C0.96086 14.811 1.46957 15 2 15C2.53043 15 3.03914 14.811 3.41421 14.4745C3.78929 14.1381 4 13.6817 4 13.2059C4 12.7301 3.78929 12.2737 3.41421 11.9373C3.03914 11.6008 2.53043 11.4118 2 11.4118Z"
                fill="#33363F"
              />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          {isAdmin && showVerify && (
            <Button variant="ghost" onClick={handleVerify}>
              <DropdownMenuItem className="font-light text-lg">
                <svg
                  width="23"
                  height="23"
                  viewBox="0 0 23 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_206_2843)">
                    <path
                      d="M12.0811 21.9875C11.7036 22.1331 11.2854 22.1331 10.9079 21.9875C7.96254 20.8566 5.42945 18.859 3.64329 16.2582C1.85711 13.6575 0.901901 10.5762 0.903811 7.42116V2.53315C0.903811 2.10103 1.07547 1.68658 1.38103 1.38103C1.6866 1.07547 2.10103 0.903809 2.53315 0.903809H20.4559C20.8879 0.903809 21.3024 1.07547 21.608 1.38103C21.9136 1.68658 22.0852 2.10103 22.0852 2.53315V7.42116C22.0871 10.5762 21.1319 13.6575 19.3458 16.2582C17.5595 18.859 15.0265 20.8566 12.0811 21.9875Z"
                      stroke="black"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.4289 6.57178L9.85749 13.9646L6.57178 11.5003"
                      stroke="black"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_206_2843">
                      <rect width="23" height="23" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span className="ml-2">
                  {isVerified ? "Batal Verifikasi" : "Verifikasi"}
                </span>
              </DropdownMenuItem>
            </Button>
          )}
          {user_id === username && (
            <Button variant="ghost" onClick={handleDelete}>
              <DropdownMenuItem className="font-light text-lg">
                <svg
                  width="23"
                  height="23"
                  viewBox="0 0 23 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.64307 5.75H21.3574"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.10742 5.75H18.8931V20.5357C18.8931 20.9714 18.72 21.3893 18.4119 21.6974C18.1039 22.0054 17.686 22.1786 17.2503 22.1786H5.75028C5.31456 22.1786 4.8967 22.0054 4.5886 21.6974C4.28051 21.3893 4.10742 20.9714 4.10742 20.5357V5.75Z"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.39307 5.74986V4.92843C7.39307 3.83915 7.82578 2.79448 8.59602 2.02424C9.36625 1.254 10.4109 0.821289 11.5002 0.821289C12.5895 0.821289 13.6342 1.254 14.4044 2.02424C15.1746 2.79448 15.6074 3.83915 15.6074 4.92843V5.74986"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.03613 10.6807V17.2546"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.9644 10.6807V17.2546"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="ml-2">Hapus</span>
              </DropdownMenuItem>
            </Button>
          )}
          {user_id !== username && (
            <DropdownMenuItem onClick={() => setIsReportDialogOpen(true)}>
              <Button variant="ghost" className="flex font-light text-lg">
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
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="ml-2">Laporkan</span>
              </Button>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ReportDialog
        isDialogOpen={isReportDialogOpen}
        setIsDialogOpen={setIsReportDialogOpen}
        id={id}
        path={path}
      />
    </>
  );
};

export default DropdownDiscussion;
