import React, { useState, useEffect } from "react";
import moment from "moment";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import DropdownDiscussion from "./DropdownDiscussion";
import { Button } from "@/components/ui/button";
import Upvote from "./Upvote";
import { getAuthenticatedUser } from "@/lib/getAuthenticatedUser";
import parse from "html-react-parser";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CommentReply from "./CommentReply";
import Switch from "./Switch"; 
import { Label } from "../ui/label";

interface CommentProps {
  id: number;
  user_id: string;
  author: string;
  content: string;
  anonymous: boolean;
  verified: boolean;
  upvote: number;
  created_at: string;
}

const Comment = ({
  id,
  user_id,
  author,
  content,
  anonymous,
  verified,
  upvote,
  created_at,
}: CommentProps) => {
  const [isVerified, setIsVerified] = useState(verified);
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [commentReplies, setCommentReplies] = useState<CommentProps[]>([]);
  const [anonymousMode, setAnonymousMode] = useState(false); // State for Anonymous Mode
  const timeAgo = moment(created_at).fromNow();

  const handleReply = () => {
    setShowReply(true);
  };

  const handleCancelReply = () => {
    setShowReply(false);
    setReplyContent("");
  };

  const handleReplySubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3000/discussion/${id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: "user910", // Ganti dengan user_id yang sesuai
          author: getAuthenticatedUser().username,
          content: replyContent, // Mengambil dari replyContent di state
          anonymous: anonymousMode, // Menggunakan nilai anonymousMode
          verified: false
        }),
      });
  
      console.log("Reply response:", response);
  
      if (response.ok) {
        const newCommentReply = await response.json();
        setCommentReplies([...commentReplies, newCommentReply]);
        setShowReply(false);
        setReplyContent("");
      } else {
        console.error("Failed to add comment reply:", response.statusText);
        // Menampilkan pesan error kepada pengguna atau melakukan penanganan yang sesuai
      }
    } catch (error) {
      console.error("Error adding comment reply:", error.message);
      // Menampilkan pesan error kepada pengguna atau melakukan penanganan yang sesuai
    }
  };

  useEffect(() => {
    const getCommentRepliesFromDB = async () => {
      try {
        const response = await fetch(`http://localhost:3000/discussion/${id}/replies`);
        if (!response.ok) {
          throw new Error("Failed to fetch comment replies");
        }
        const data = await response.json();
        setCommentReplies(data);
      } catch (error) {
        console.error("Error fetching comment replies:", error.message);
        // Menampilkan pesan error kepada pengguna atau melakukan penanganan yang sesuai
      }
    };

    getCommentRepliesFromDB();
  }, [id]);

  return (
    <>
      <section className="py-4 flex justify-between">
        <div className="flex items-center">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <div className="text-base font-semibold text-black">
              {anonymous ? "*****" : author} •{" "}
              <span className="text-gray-600 font-light">{timeAgo}</span>
              {isVerified && (
                <span className="border border-[#38B0AB] text-xs rounded-2xl px-4 py-1 text-[#38B0AB] ml-2">
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>
        <div>
          <DropdownDiscussion
            showVerify={true}
            user_id={user_id}
            commentId={id}
            setIsVerified={setIsVerified}
            isVerified={isVerified}
            path="/comment"
            id={id}
          />
        </div>
      </section>

      <section className="ml-12 px-1 pb-4">
        <div className="font-light">{parse(content)}</div>
      </section>

      <section className="ml-12 flex space-x-6 mb-4">
      

        <div className="flex place-items-center">
          <button
            onClick={handleReply}
            className="flex items-center text-gray-500 hover:text-black"
          >
            <svg
              width="23"
              height="18"
              viewBox="0 0 23 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.39296 16.0716L0.821533 17.3574L2.46439 13.5002V1.92878C2.46439 1.58778 2.63748 1.26076 2.94557 1.01964C3.25367 0.778525 3.67153 0.643066 4.10725 0.643066H20.5358C20.9715 0.643066 21.3894 0.778525 21.6975 1.01964C22.0055 1.26076 22.1787 1.58778 22.1787 1.92878V14.7859C22.1787 15.1269 22.0055 15.454 21.6975 15.6951C21.3894 15.9361 20.9715 16.0716 20.5358 16.0716H7.39296Z"
                stroke="black"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.39307 6.42871H17.2502"
                stroke="black"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.39307 10.2861H13.9645"
                stroke="black"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="ml-2 font-medium">Balas</p>
          </button>
        </div>

        <Upvote commentId={id} user_id={getAuthenticatedUser().username} upvote={upvote}/>
      </section>

      {showReply && (
        <section className="ml-12 pb-4">
          <div className="flex items-center ml-2 mb-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <div className="text-base font-semibold text-black">
                {getAuthenticatedUser().username}
              </div>
            </div>
          </div>
          <ReactQuill
            theme="snow"
            value={replyContent}
            onChange={setReplyContent}
            placeholder="Balas komentar ini..."
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ color: [] }, { background: [] }],
                ["link", "image"],
                ["code-block"],
                ["clean"],
              ],
            }}
            formats={[
              "header",
              "bold",
              "italic",
              "underline",
              "strike",
              "blockquote",
              "list",
              "bullet",
              "indent",
              "link",
              "image",
              "color",
              "background",
              "code-block",
            ]}
          />
          <div className="flex justify-between mt-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex items-center ">
              <Switch checked={anonymousMode} onChange={setAnonymousMode} /> {/* Switch for Anonymous Mode */}
              <Label htmlFor="anonymous-mode" className="ml-2 cursor-pointer">Anonymous Mode</Label>
            </div>
          </div>
          <div className="flex">
          <Button
            onClick={handleReplySubmit}
            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md">
            Balas
          </Button>
            <Button onClick={handleCancelReply} variant="secondary" className="ml-2">Batal</Button>
            
            </div>
          </div>
        </section>
      )}

      {/* Render Comment Replies */}
      {commentReplies.map((reply) => (
        <CommentReply
          key={reply.id}
          id={reply.id}
          user_id={reply.user_id}
          author={reply.author}
          content={reply.content}
          anonymous={reply.anonymous}
          created_at={reply.created_at}
        />
      ))}

      <hr />
    </>
  );
};

export default Comment;
