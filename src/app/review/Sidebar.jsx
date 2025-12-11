"use Client";

// import { useEffect, useState } from 'react';
// import { CirclePlus } from "@/components/animate-ui/icons/circle-plus"
import { Loader2 } from "lucide-react"
import { Pin } from '@/components/animate-ui/icons/pin';
import { SendHorizontal } from '@/components/animate-ui/icons/send-horizontal';
import { Clapperboard, Image } from "lucide-react"
// import {
//     Table,
//     TableBody,
//     TableCaption,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table"
import { motion } from 'motion/react';

const SidebarLeft = ({ loading, CaseFiles, setCaseFiles, setFile }) => {

    const Url_Submit = async (e) => {
        e.preventDefault();

        const input_url = e.target.url.value;

        const response = await fetch("/api/get-image-url", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                image_url: input_url,
            }),
        });
        const data = await response.json();
        console.log(data);

        const strucutre = {
            "ai_result": {
                "accuracy": null,
                "result": null,
                "type": null
            },
            "suspicious_labels": [],
            "action_labels": [],
            "agent_review": null,
            "review_comment": null,
            "previously_reviewed": false,
            "marked": false,
            "faces_data": [],
            "active": true,
            "media_type": data.url.includes("mp4") ? "video" : "image",
            "url": input_url,
            "image_url": data.url
        }

        setCaseFiles((prev) => [...prev, strucutre]);
        e.target.url.value = "";
    }

    return (
        <div className=' bg-blue-600/10 mt-14 pt-6 pb-2 px-5 w-full max-w-[25vw] min-w-[20vw] overflow-hidden '>

            <div className=' left-0 top-5  text-white flex flex-col pb-5 items-center justify-between h-[90vh] gap-5 '>
                <div className='w-full flex flex-col items-center gap-5'>
                    <div className=' pb-4 px-3 rounded-lg w-full text-black font-semibold text-2xl'>
                        Case List
                        {/* <Table className={""}>
                            <TableBody className={""}>
                                <TableRow className={"hover:bg-transparent border-0 "}>
                                    <TableHead className={"text-black text-center font-light text-lg "}>AI generated</TableHead>
                                    <TableHead className={"text-black text-center mx-2 font-light text-lg"}>Suspicious</TableHead>
                                </TableRow>
                                <TableRow className={"hover:bg-transparent"}>
                                    <TableHead className={"text-black text-xl text-center font-semibold "}>5</TableHead>
                                    <TableHead className={"text-black text-xl rounded-full text-center font-semibold mx-2"}>4</TableHead>
                                </TableRow>
                            </TableBody>
                        </Table> */}
                    </div>

                    <div className='w-full h-[63vh] overflow-auto  flex flex-col gap-5 items-center'>
                        {
                            loading ? (
                                <div className='w-full h-full flex items-center justify-center'>
                                    <Loader2 className="h-8 w-8 animate-spin" stroke="black" />
                                </div>
                            ) : CaseFiles.length > 0 ? (
                                CaseFiles.map((filedata, index) => (
                                    <div key={index}
                                        className={" bg-white text-black border backdrop-blur-md p-3 rounded-lg w-full min-h-24 cursor-pointer transition-colors "}
                                        onClick={() => { return setFile(filedata) }}
                                    >
                                        <div className='w-full flex items-center justify-between'>
                                            <div className='flex flex-col gap-5 w-full'>
                                                <div className='text-sm '>
                                                    <span className='font-bold border px-1.5 py-0.5 rounded-full bg-muted mr-4'>
                                                        {index + 1}
                                                    </span>
                                                    {filedata?.url?.split("/")[5]}
                                                </div>
                                                <div className='flex flex-wrap justify-between gap-1'>
                                                    {filedata?.marked &&
                                                        <span className='text-sm px-2 py-0.5 rounded-3xl '>
                                                            <Pin fill="white" size={20} />
                                                        </span>
                                                    }
                                                    <span className='text-sm bg-blue-700 font-bold text-white px-2 py-0.5 h-fit rounded-3xl '>
                                                        {filedata.ai_result.result === null ? "Pending" : filedata?.ai_result?.result}
                                                    </span>
                                                    {/* pending / good / blocked */}
                                                    <span className={`text-sm  px-3 py-0.5 rounded-3xl ${filedata.agent_review === null ? "bg-neutral-100 border text-black" : filedata?.agent_review === "blocked" ? "bg-red-500 text-white" : filedata?.agent_review === "pending" ? "bg-neutral-100 border text-black" : "bg-emerald-500 text-white"}`}>
                                                        {filedata.agent_review === null ? "Pending" : filedata?.agent_review === "blocked" ? "Blocked" : filedata?.agent_review === "pending" ? "Pending" : "Good"}
                                                    </span>
                                                    <span className='text-sm  px-3 py-0.5 rounded-3xl '>
                                                        {filedata?.media_type === "image" ?
                                                            (
                                                                <span className="flex items-center gap-1">
                                                                    <Image size={20} strokeWidth={1.5} />
                                                                    Image
                                                                </span>
                                                            ) :
                                                            (
                                                                <span className="flex items-center gap-1">
                                                                    <Clapperboard size={20} strokeWidth={1.5} />
                                                                    Video
                                                                </span>
                                                            )
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div>
                                            yo
                                        </div> */}
                                    </div>
                                ))
                            ) :
                                (
                                    <div className=' py-20 px-10 '>
                                        No files found
                                    </div>
                                )
                        }
                    </div >
                </div >

                <div className={` bg-white w-full flex flex-col gap-2 justify-end border border-black/20 text-black p-3 rounded-xl transition-all overflow-hidden`}>
                    <div className=' w-full flex gap-2 items-center justify-between rounded-xl transition-colors'>
                        <span>
                            Add Case
                        </span>
                    </div>

                    <form onSubmit={Url_Submit} className={`flex flex-row gap-4 transition-all`}>
                        <input type="url" id='url' required placeholder="Case URL" className="w-full p-2 min-h-14 rounded-lg border border-blue-700/30 focus:outline-2 outline-0 outline-blue-700/20 transition-all " />
                        <motion.button
                            whileTap={{ scale: 0.975 }}
                            className=" h-14 w-14 rounded-lg bg-blue-700 text-white cursor-pointer flex items-center justify-center"
                            type='submit'
                        >
                            <SendHorizontal size={20} animateOnHover />
                        </motion.button>
                    </form>
                </div>
            </div >
        </div >
    );
};

export default SidebarLeft;