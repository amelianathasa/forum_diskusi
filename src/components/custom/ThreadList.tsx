import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ThreadCard from "@/components/custom/ThreadCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useDiscussion } from "@/DiscussionContext";

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
  const [filteredDiscussions, setFilteredDiscussions] =
    useState<ThreadProps[]>(discussions);
  const [found, setFound] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      const searchTerm = searchQuery.toLowerCase();
      const filteredDiscussions = discussions.filter(
        (discussion: ThreadProps) => {
          // Check for search term in title or other fields you want to search
          return (
            discussion.title.toLowerCase().includes(searchTerm) ||
            discussion.content.toLowerCase().includes(searchTerm)
          );
        }
      );
      // Update a state variable to display filtered results
      setFilteredDiscussions(filteredDiscussions);
      setFound(true);
    } else {
      //If the search query is empty, reset to original discussions
      setFilteredDiscussions(discussions);
      setFound(false);
    }
  };

  return (
    <div className="container text-left mx-auto p-4">
      {/* Button "Tambah" */}
      <div className="flex justify-between items-center mb-5">
        <Button className="bg-[#38B0AB] hover:bg-teal-700 text-gray-100 px-4 py-2 rounded-md flex items-center">
          <FontAwesomeIcon icon={faPlus} className="mr-2 text-lg" />
          Tambah
        </Button>

        <div className="flex items-center">
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
        </div>
      </div>
      {(!found)
        ? discussions.map((thread : ThreadProps) => (
            <ThreadCard
              key={thread.id}
              threadId={thread.id}
              authorName={thread.author}
              title={thread.title}
              content={thread.content|| ""}
              anonymous={thread.anonymous}
              commentCount={thread.comment_count}
              thread_tag={thread.thread_tag}
              createdTime={thread.created_at}
            />
          ))
        : filteredDiscussions.map((thread) => (
            <ThreadCard
              key={thread.id}
              threadId={thread.id}
              authorName={thread.author}
              title={thread.title}
              content={thread.content|| ""}
              anonymous={thread.anonymous}
              commentCount={thread.comment_count}
              thread_tag={thread.thread_tag}
              createdTime={thread.created_at}
            />
          ))}
    </div>
  );
}

export default MainPage;