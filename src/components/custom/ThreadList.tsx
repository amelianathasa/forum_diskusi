import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import ThreadCard from "@/components/custom/ThreadCard";
import FormDialog from "@/components/custom/FormDialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useDiscussion } from "@/DiscussionContext";
import { getAuthenticatedUser } from "@/lib/getAuthenticatedUser";
import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"; // Import komponen Pagination dari file terpisah

interface ThreadProps {
  id: string;
  author: string;
  title: string;
  content: string;
  anonymous: boolean;
  comment_count: number;
  created_at: string;
  thread_tag: {
    tag: {
      id: string;
      name: string;
    }
  }[];
}

function MainPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { discussions, fetchDiscussionList } = useDiscussion();
  const [filteredDiscussions, setFilteredDiscussions] = useState<ThreadProps[]>([]);
  const [found, setFound] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const threadsPerPage = 3;

  const isAdmin = getAuthenticatedUser().administrator;

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      const searchTerm = searchQuery.toLowerCase();
      const filteredDiscussions = discussions.filter((discussion: ThreadProps) => {
        return (
          discussion.title.toLowerCase().includes(searchTerm) ||
          discussion.content.toLowerCase().includes(searchTerm)
        );
      });
      setFilteredDiscussions(filteredDiscussions);
      setFound(true);
    } else {
      setFilteredDiscussions(discussions);
      setFound(false);
    }
  };

  const openFormDialog = () => {
    setIsFormOpen(true);
  }

  const closeFormDialog = () => {
    setIsFormOpen(false);
  }

  const handleSubmit = () => {
    closeFormDialog();
  }

  const indexOfLastThread = currentPage * threadsPerPage;
  const indexOfFirstThread = indexOfLastThread - threadsPerPage;
  const currentThreads = found ? filteredDiscussions.slice(indexOfFirstThread, indexOfLastThread) : discussions.slice(indexOfFirstThread, indexOfLastThread);
  const totalPages = Math.ceil((found ? filteredDiscussions.length : discussions.length) / threadsPerPage);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container text-left mx-auto p-4">
      {/* Konten utama */}
      <div className="flex justify-between items-center mb-5">
        {/* Tombol "Tambah" */}
        <Button className="bg-[#38B0AB] hover:bg-teal-700 text-gray-100 px-4 py-2 rounded-md flex items-center" onClick={openFormDialog}>
          <FontAwesomeIcon icon={faPlus} className="mr-2 text-lg" />
          Tambah
        </Button>

        <div className="flex items-center">
          {/* Input pencarian */}
          <Input
            className="mr-3 w-full"
            placeholder="Search Discussion"
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <Button
            className="bg-[#38B0AB] hover:bg-teal-700"
            onClick={handleSearch}
          >
            Cari
          </Button>
          {isAdmin && (
            <div className="ml-3">
              <Link to="/report-list">
                <Button className="bg-[#38B0AB] hover:bg-teal-700">
                  Daftar Report
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Daftar thread */}
      {currentThreads.map((thread: ThreadProps) => (
        <ThreadCard
          key={thread.id}
          threadId={thread.id}
          authorName={thread.author}
          title={thread.title}
          content={thread.content || ""}
          anonymous={thread.anonymous}
          commentCount={thread.comment_count}
          thread_tag={thread.thread_tag}
          createdTime={thread.created_at}
        />
      ))}

      {/* Pagination */}
      <Pagination className="mt-4" aria-label="pagination">
        <PaginationContent>
          <PaginationItem>
            <PaginationLink
              className="mx-1"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              {"<<"}
            </PaginationLink>
          </PaginationItem>
          <PaginationPrevious
            className="mx-1"
            onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </PaginationPrevious>
          {/* Page Numbers */}
          {pageNumbers.map((number, index) => {
            // Show only 5 page numbers at a time, centered around the current page
            const startPage = Math.max(currentPage - 2, 1);
            const endPage = Math.min(startPage + 4, totalPages);
            if (index >= startPage - 1 && index <= endPage - 1) {
              return (
                <PaginationItem key={number}>
                  <PaginationLink
                    className={`mx-1 ${currentPage === number ? 'bg-gray-300' : ''}`}
                    onClick={() => setCurrentPage(number)}
                  >
                    {number}
                  </PaginationLink>
                </PaginationItem>
              );
            }
            return null;
          })}
          <PaginationNext
            className="mx-1"
            onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </PaginationNext>
          <PaginationItem>
            <PaginationLink
              className="mx-1"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              {'>>'}
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Dialog Form */}
      <FormDialog isOpen={isFormOpen} onClose={closeFormDialog} onSubmit={handleSubmit} />
    </div>
  );
}

export default MainPage;
