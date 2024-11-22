"use client";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { Button } from "@/components/ui/button";
import {
  CornerDownLeft,
  LogOut,
} from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useParams, useRouter } from "next/navigation";
import Pusher from "pusher-js";
import { DashboardContext } from "@/dashboardContext/dashboard";
import { fetchMessages, messageCollection, verifyChat } from "@/ImportantFunctions/chat";
import { logoutUser } from "@/appwrite/auth";

export default function Home() {
  const [input, setInput] = useState(null)
  const router = useRouter()
  const { userDoc, user } = useContext(DashboardContext)
  const [messages, setMessages] = useState([])
  const params = useParams()
  const [channelId, setChannelId] = useState(params.room.split("-")[0])
  const [eventId, setEventId] = useState(params.room.split("-")[1])
  const [rider, setRider] = useState(null)
  const messagesRef = useRef(null);

  const fetchData = () => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: "eu",
      encrypted: true
    });
    const channel = pusher.subscribe(channelId)
    channel.bind(eventId, (data) => {
      setMessages((pre) => [...pre, data])
    })
  }
  
  useEffect(() => {
    if (!user && !userDoc){
      router.push("/chat/login?code="+params.room)
    }
    if(user){
      (async () => {
        const chatRes = await verifyChat(params.room, user.email)
        // Return 
        // if (!chatRes) return router.push("/")
      })()
    }
  }, [user])

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (userDoc){
      setRider(true)
    }else{
      setRider(false)
    }
  }, [userDoc])

  useEffect(() => {
    // console.log(messages)
  }, [messages])
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    (async () => {
      const rider = await fetchMessages(params.room)
      setMessages(rider)
    })()
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/pusher', {
        method: "POST",
        body: JSON.stringify({
            message: input,
            rider,
            channelId,
            eventId
        }),
        "content-type": "application/json"
    })
    // console.log(res)
    fetchData()
    setInput("")
    const rep = await messageCollection(params.room, input, rider)
    // console.log(rep)
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="w-[100vw] bg-indigo-200">
    <main className="flex h-screen w-full max-w-3xl flex-col items-center mx-auto py-6 bg-indigo-200">
      <ChatMessageList ref={messagesRef} className="" >
        {messages.length === 0 && (
          <div className="w-full bg-background shadow-sm border rounded-lg p-8 flex flex-col gap-2">
            <h1 className="font-bold text-indigo-950">Welcome to Lwalewah!</h1>
            <p className="text-muted-foreground text-sm">
              We are excited to have you here! Whether you are a rider or a customer, Lwalewah is designed to make your experience smooth, reliable, and enjoyable.
            </p>
            <p className="text-muted-foreground text-sm">
            Need help? Our team is always here to assist. Let s get started! 🚀
            </p>
          </div>
        )}
        {messages &&
          messages.map((message, index) => (
            <>
            {message.rider ? 
            <ChatBubble
              key={index}
              className=""
              variant={message.role == "user" ? "sent" : "received"}
            >
              <ChatBubbleAvatar
                src=""
                fallback={"🚴‍♂️"}
              />
              <ChatBubbleMessage
              className="bg-indigo-950 text-white"
              >
                {message.message
                  .split("```")
                  .map((part, index) => {
                    if (index % 2 === 0) {
                      return (
                        <Markdown key={index} remarkPlugins={[remarkGfm]}>
                          {part}
                        </Markdown>
                      );
                    } else {
                      return (
                        <pre className="whitespace-pre-wrap pt-2" key={index}>
                          {/* <CodeDisplayBlock code={part} lang="" /> */}
                        </pre>
                      );
                    }
                  })}
              </ChatBubbleMessage>
            </ChatBubble>:  <ChatBubble
              key={index}
              className="self-end"
            >
              <ChatBubbleAvatar
                src=""
                fallback={'👨🏽'}
              />
              <ChatBubbleMessage
              className="bg-indigo-700 text-white"
              >
                {message.message
                  .split("```")
                  .map((part, index) => {
                    if (index % 2 === 0) {
                      return (
                        <Markdown key={index} remarkPlugins={[remarkGfm]}>
                          {part}
                        </Markdown>
                      );
                    } else {
                      return (
                        <pre className="whitespace-pre-wrap pt-2" key={index}>
                          {/* <CodeDisplayBlock code={part} lang="" /> */}
                        </pre>
                      );
                    }
                  })}
              </ChatBubbleMessage>
            </ChatBubble> }
            </>
          ))}

      </ChatMessageList>
      <div className="w-full px-4">
        <form
          onSubmit={onSubmit}
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
        >
          <ChatInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0">
           
            <Button
              disabled={!input}
              type="submit"
              size="sm"
              className="bg-indigo-950"
            >
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
            <Button
              type="button"
              size="sm"
              className="ml-auto gap-1.5 bg-indigo-950"
              onClick={() => {logoutUser(); router.push("/")}}
            >
              Logout
              <LogOut className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
      <div className="pt-4 flex gap-2 items-center">
      </div>
    </main>
    </div>
  );
}