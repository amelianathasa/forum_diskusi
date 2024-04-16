import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import parse from "html-react-parser";
import moment from "moment";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

interface ThreadCardProps {
  threadId: string;
  authorName: string;
  createdTime: string;
  title: string;
  anonymous: boolean;
  content: string;
  commentCount: number;
  thread_tag: {
    tag: {
      id: string;
      nama_tag: string;
    }
  }[];
}

const ThreadCard = ({
  threadId,
  authorName,
  createdTime,
  title,
  anonymous,
  content,
  commentCount,
  thread_tag,
}: ThreadCardProps) => {
  const timeAgo = moment(createdTime).fromNow();
  return (
    <Link to={`/discussion/${threadId}`}>
      {" "}
      {/* Wrap content for redirection */}
      <Card className="mb-5 bg-[#F5F7F9]">
        {" "}
        <CardHeader className="py-4">
          <div className="flex items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              {" "}
              <CardTitle className="text-base font-normal text-black">
                {anonymous ? "*****" : authorName} •{" "}
                <span className="text-gray-600">{timeAgo}</span>
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-sm pb-2">
          <div className="font-medium mb-3 text-[#1F1D39]">{title}</div>
          <div className="text-[#676767]">{parse(content)}</div>
        </CardContent>
        <CardFooter className="pb-4">
          <div className="flex-row justify-between">
            <div className="pb-2">
              {thread_tag.length > 0 ? ( 
                thread_tag.map((tag) => (
                  <span key={tag.tag.id} className="text-xs font-medium rounded-md p-1 px-2 mr-2 bg-[#F9A682] text-[#B23E19]">
                    {tag.tag.nama_tag}
                  </span>
                ))
              ) : (
                <p>no tags</p>
              )}
            </div>
            <div className="flex items-center mt-1 text-[#676767]">
              <img src="src\assets\chat-bubble.svg" alt="chat-bubble" />
              <p className="ml-2">{commentCount} Balasan</p>
            </div>
          </div>
        </CardFooter>
      </Card>

    </Link>
  );
};

export default ThreadCard;
