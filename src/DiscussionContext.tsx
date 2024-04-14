import { createContext, useContext, useEffect, useState } from "react";

interface Discussion {
  id: number;
  author: string;
  title: string;
  content: string;
  anonymous: boolean;
  comment_count: number;
  created_at: string;
  comment: {
    id: number;
    user_id: string;
    author: string;
    content: string;
    anonymous: boolean;
    verified: boolean;
    created_at: string;
  }[];
  thread_tag: {
    tag: {
      id: number;
      name: string;
    }
  }[];
}

interface Props {
  children: React.ReactNode;
}

const DiscussionContext = createContext<{
  discussions: Discussion[];
  fetchDiscussionList: () => void;
} | null>(null);

export function DiscussionProvider({ children }: Props) {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);

  const fetchDiscussionList = async () => {
    try {
      const response = await fetch("http://localhost:3000/discussion/");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setDiscussions(data);
    } catch (error) {
      console.error("Error fetching threads:", error);
    }
  };

  useEffect(() => {
    fetchDiscussionList();
  }, []);

  return (
    <DiscussionContext.Provider value={{ discussions, fetchDiscussionList }}>
      {children}
    </DiscussionContext.Provider>
  );
}

export const useDiscussion = () => {
  const context = useContext(DiscussionContext);
  if (!context) {
    throw new Error("useDiscussion must be used within a DiscussionProvider");
  }
  return context;
};
