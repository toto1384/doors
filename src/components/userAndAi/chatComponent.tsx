import { FileUIPart } from "ai";
import { MessageType } from "./aiChatbot";
import { Status } from "@elevenlabs/react";
import { useState } from "react";
import { usePopoversOpenStore } from "@/routes/__root";
import { useShallow } from "zustand/react/shallow";
import { PromptInput, PromptInputAttachment, PromptInputAttachments, PromptInputBody, PromptInputButton, PromptInputMessage, PromptInputSubmit, PromptInputTextarea, PromptInputToolbar, PromptInputTools } from "../ai-elements/prompt-input";
import { ChevronDown, CopyIcon, Play, RefreshCcwIcon, StopCircleIcon } from "lucide-react";
import { Conversation, ConversationContent, ConversationScrollButton } from "../ai-elements/conversation";
import { Message, MessageContent } from "../ai-elements/message";
import { Response } from "../ai-elements/response";
import { Actions } from "../ai-elements/actions";
import { Loader } from "../ai-elements/loader";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { UserType } from "utils/constants";



export const ChatComponent = ({ messages, sendMessage, sendUserActivity, status, startConversation, endConversation, agentState, demoVersion, firstMessage, userType }: {
    messages: MessageType[],
    sendMessage: ({ files, text }: { text: string, files?: FileUIPart[] }) => void,
    sendUserActivity: () => void,
    status: Status, startConversation: () => void, endConversation: () => void
    agentState: 'not-started' | 'stopped'
    firstMessage: string
    demoVersion: boolean | undefined
    userType: typeof UserType[number] | undefined
}) => {
    const { t } = useTranslation();
    const [input, setInput] = useState('');

    const { aiChatbotOpen, setAiChatbotOpen } = usePopoversOpenStore(useShallow(state => ({
        aiChatbotOpen: state.aiChatbotOpen,
        setAiChatbotOpen: state.setAiChatbotOpen,
    })))

    const handleSubmit = (message: PromptInputMessage) => {
        const hasText = Boolean(message.text);
        const hasAttachments = Boolean(message.files?.length);

        if (!(hasText || hasAttachments)) {
            return;
        }

        sendMessage({ text: message.text || 'Sent with attachments', files: message.files },
        );
        setInput('');
    };

    const { progressBar, } = usePopoversOpenStore(useShallow(state => ({
        progressBar: state.progressBar,
    })))

    return (
        <div className="mx-auto py-4 relative h-full w-full">
            <div className="flex flex-col h-full ">

                <div className='flex flex-row items-start justify-between border-b border-[#404040 rounded-b-lg'>
                    <div className='flex flex-row items-center px-3 pb-5 gap-2 '>
                        <img src={'/android-chrome-512x512.png'} className="w-[35px] h-[35px] object-contain bg-[#525252]/10 rounded-full p-2 object-center" />
                        <div className="flex flex-col mr-3">
                            <p >{t('ai-chatbot.assistant')}</p>
                            <p className="text-xs text-[#a3a3a3]">Online</p>
                        </div>
                    </div>

                    <div className='p-2 md:hidden' onClick={() => setAiChatbotOpen(!aiChatbotOpen)}><ChevronDown className='w-6 h-6' /></div>
                </div>

                {progressBar != undefined && <div className="md:hidden mt-1 px-2">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">{progressBar.checkedSteps}/{progressBar.totalSteps} {'Details Completed'}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progressBar.progress}%` }}
                        ></div>
                    </div>
                </div>
                }

                <Conversation className="h-full no-scrollbar">
                    <ConversationContent className='bg-transparent p-0 min-h-full flex flex-col '>
                        {messages.length === 0 && agentState !== 'stopped' && <div className='flex flex-col min-h-full grow-1 flex-1 p-2 justify-center items-center'>
                            <div className='flex absolute top-3 left-2 right-6 flex-col text-sm items-center justify-center bg-[#241540] opacity-90 rounded-lg p-2 object-center'>
                                {firstMessage}
                            </div>
                        </div>}

                        {agentState === 'stopped' && <div className='flex flex-col min-h-full grow-1 flex-1 items-center justify-center'>

                            {demoVersion && <div className="text-center p-6 bg-[#241540] rounded-lg mx-4">
                                {userType === 'buyer' && (
                                    <div className="space-y-4">
                                        <p className="text-white text-lg">
                                            {t('ai-chatbot.demo.buyer.message')}
                                        </p>
                                        <Link
                                            to="/auth/$path"
                                            params={{ path: "sign-in" }}
                                            className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-md font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                                        >
                                            {t('ai-chatbot.demo.buyer.loginButton')}
                                        </Link>
                                    </div>
                                )}

                                {userType === 'seller' && (
                                    <div className="space-y-4">
                                        <p className="text-white text-lg">
                                            {t('ai-chatbot.demo.seller.message')}
                                        </p>
                                        <Link
                                            to="/auth/$path"
                                            params={{ path: "sign-in" }}
                                            className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-md font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                                        >
                                            {t('ai-chatbot.demo.seller.loginButton')}
                                        </Link>
                                    </div>
                                )}

                                {userType === undefined && (
                                    <div className="space-y-4">
                                        <p className="text-white text-lg">
                                            {t('ai-chatbot.demo.undefined.message')}
                                        </p>
                                        <Link
                                            to="/auth/$path"
                                            params={{ path: "sign-in" }}
                                            className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-md font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                                        >
                                            {t('ai-chatbot.demo.undefined.loginButton')}
                                        </Link>
                                    </div>
                                )}
                            </div>}

                            {!demoVersion && <div className="text-center p-6 bg-[#241540] rounded-lg mx-4">
                                {userType === 'buyer' && (
                                    <p className="text-white text-lg">
                                        {t('ai-chatbot.production.buyer.message')}
                                    </p>
                                )}

                                {userType === 'seller' && (
                                    <p className="text-white text-lg">
                                        {t('ai-chatbot.production.seller.message')}
                                    </p>
                                )}

                                {userType === undefined && (
                                    <p className="text-white text-lg">
                                        {t('ai-chatbot.production.undefined.message')}
                                    </p>
                                )}
                            </div>}

                        </div>}
                        {messages.length > 0 && agentState !== 'stopped' && messages.map((message, i) => (
                            <div key={message.id.toString()}>
                                <div key={`${message.message}-${i}`}>
                                    {typeof message.message == 'string' ?
                                        <Message from={message.source === 'ai' ? 'assistant' : 'user'}>
                                            <MessageContent className='group-[.is-user]:bg-[#8A4FFF] group-[.is-assistant]:bg-[#241540] mx-2'>
                                                <Response >
                                                    {message.message}
                                                </Response>
                                                {(message.source === 'ai' && typeof message.message == 'string' && i === messages.length - 1) && (
                                                    <Actions className="mt-2">
                                                        <Action
                                                            // onClick={() => regenerate()}
                                                            onClick={() => console.log('regenerate')}
                                                            label="Retry"
                                                        >
                                                            <RefreshCcwIcon className="size-3" />
                                                        </Action>
                                                        <Action
                                                            onClick={() =>
                                                                navigator.clipboard.writeText(message.message as string)
                                                            }
                                                            label="Copy"
                                                        >
                                                            <CopyIcon className="size-3" />
                                                        </Action>
                                                    </Actions>
                                                )}
                                            </MessageContent>
                                        </Message>
                                        : message.message}
                                </div>
                            </div>
                        ))}
                    </ConversationContent>
                    <ConversationScrollButton />
                </Conversation>

                <div className='px-3 w-full flex'>
                    <PromptInput onSubmit={handleSubmit} className="mt-4 px-2 " globalDrop multiple>
                        {status === 'connected' && <>
                            <PromptInputBody>
                                <PromptInputAttachments>
                                    {(attachment) => <PromptInputAttachment data={attachment} />}
                                </PromptInputAttachments>
                                <PromptInputTextarea
                                    onChange={(e) => {
                                        sendUserActivity()
                                        return setInput(e.target.value)
                                    }}
                                    value={input}
                                />
                            </PromptInputBody>

                            <PromptInputToolbar>
                                <PromptInputTools>
                                    {/*<PromptInputActionMenu>
                                {/*<PromptInputActionMenuTrigger />
                                <PromptInputActionMenuContent>
                                    <PromptInputActionAddAttachments />
                                </PromptInputActionMenuContent>
                            </PromptInputActionMenu>*/}
                                    <PromptInputButton
                                        onClick={() => endConversation()}
                                        variant={'destructive'}
                                    >
                                        <StopCircleIcon size={16} />
                                        <span className="sr-only">Microphone</span>
                                    </PromptInputButton>
                                </PromptInputTools>
                                <PromptInputSubmit disabled={!input && !status} status={status as any} />
                            </PromptInputToolbar>

                        </>}

                        {status === 'disconnected' && <>
                            <PromptInputButton
                                onClick={() => startConversation()}
                                variant={'default'}
                                className='w-full cursor-pointer'
                            >
                                <span className="">{t('ai-chatbot.startConversation')}</span>
                                <Play size={16} />
                            </PromptInputButton>
                        </>}

                        {(status === 'disconnecting' || status === 'connecting') && <>
                            <Loader />
                        </>}
                    </PromptInput>

                </div>
            </div>
        </div>
    );
};

function Action({ onClick, label, children }: ActionProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-slate-400 focus-visible:outline-offset-2"
        >
            {children}
            <span className="sr-only">{label}</span>
        </button>
    );
}

interface ActionProps {
    onClick: () => void;
    label: string;
    children: React.ReactNode;
}
