"use client"

import { useEffect, useState } from 'react';
import { Progress } from '@/components/animate-ui/components/radix/progress';
import { Card } from "@/components/ui/card"
import { Bot } from "@/components/animate-ui/icons/bot"
import { BotOff } from "@/components/animate-ui/icons/bot-off"
import { ManagementBar } from '@/components/animate-ui/components/community/management-bar';
import { motion } from 'motion/react';
import Sidebar from './Sidebar';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const page = () => {
    const [file, setFile] = useState(null);
    const [CaseFiles, setCaseFiles] = useState([]);

    useEffect(() => {
        const fetch_active_files = async () => {
            const response = await fetch("/api/get-active-files", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            setCaseFiles(data);
            console.log(data);
        }

        if (!CaseFiles.length) {
            fetch_active_files();
        }

    }, [CaseFiles]);

    const mark_for_review = async () => {
        try {
            const response = await fetch(`/api/mark-for-review`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    image_url: file?.image_url,
                    current_mark_status: file?.marked,
                }),
            })
            const data = await response.json();
            console.log(data);
        }
        catch (error) {
            console.log(error);
        }
    }
    const go_to_file = (direction) => {
        if (direction === "next") {
            const index = CaseFiles.findIndex((filedata) => filedata.image_url === file.image_url);
            if (index !== CaseFiles.length - 1) {
                setFile(CaseFiles[index + 1]);
            }
        } else {
            const index = CaseFiles.findIndex((filedata) => filedata.image_url === file.image_url);
            if (index !== 0) {
                setFile(CaseFiles[index - 1]);
            }
        }
    }
    const submit_comment_review = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/comment-review`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    image_url: file?.image_url,
                    comment: file?.review_comment,
                }),
            })
            const data = await response.json();
            console.log(data);
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='flex divide-x-[0.5px] divide-neutral-400 bg-black '>
            <div className=' absolute top-0 left-0 m-0 bg-white/30 backdrop-blur-xl w-screen h-14 z-20 px-5 py-2 flex items-center border-b '>

                <div className='text-white font-bold text-xl'>
                    Cases Review
                </div>
            </div>

            {/* sidebar */}
            <Sidebar CaseFiles={CaseFiles} setCaseFiles={setCaseFiles} setFile={setFile} />

            {/* case review */}
            <div className=" pt-20 w-full p-5 bg-linear-90 to-blue-900 from-black text-white ">

                <div className="flex gap-5 ">
                    <Card className={" w-full max-h-[70vh] overflow-hidden aspect-auto p-0 bg-white/10 backdrop-blur-xl bg-radial-[at_50%_75%] from-black/50 to-transparent border-0 "} >

                        {file === null && (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="text-white font-bold text-2xl">
                                    No file selected
                                </div>
                            </div>
                        )}
                        {
                            file && file["media_type"] === "image" &&
                            (
                                <img src={file["image_url"]} className="w-full h-full object-contain" />
                            )
                        }
                        {
                            file && file["media_type"] === "video" &&
                            (
                                <video controls src={file["image_url"]} className="w-full h-full" />
                            )
                        }
                    </Card>

                    <div className={" min-w-[400px] text-white bg-transparent shadow-none py-0 flex flex-col gap-5"}>
                        {/* OVERALL RESULT */}
                        <Card className={"p-5 text-white bg-white/10 backdrop-blur-lg border-0 "}>
                            <div className="font-bold text-2xl ">
                                Agent Review
                            </div>
                            <div className="">
                                {file?.agent_review ?
                                    "Harmful activity or event detected" :
                                    "No harmful activity or event detected"
                                }
                            </div>
                        </Card>

                        {/* AI DETECTION */}
                        <Card className={"p-5 text-white bg-white/10 backdrop-blur-lg border-0 "}>
                            <div className="font-bold text-2xl ">
                                AI Detection Result
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text">
                                    {file?.ai_result?.result === "ai" ? "Fully AI generated" : "Not AI generated"}
                                </div>
                                <div className=' max-w-[220px]'>
                                    <div className="font-bold" >
                                        Accuracy - {(file?.ai_result?.accuracy * 100).toFixed(2)}%
                                    </div>
                                    <div>
                                        <Progress
                                            value={file?.ai_result ? (file.ai_result?.accuracy * 100) : 0}
                                            className={"w-full border border-white/30 "}
                                            indicator_className={(((file?.ai_result) ? (file.ai_result?.accuracy * 100) : 0) > 60 ? " bg-linear-90 from-green-600 to-green-400" : file?.ai_result?.accuracy * 100 > 40 ? "bg-linear-90 from-orange-600 to-orange-400" : "bg-linear-90 from-red-600 to-red-400")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* LABELS */}
                        <Card className={"p-5 text-white bg-white/10 backdrop-blur-lg border-0 h-full"}>
                            <div className="font-bold text-2xl ">
                                Labels
                            </div>
                            <div className=" flex flex-col justify-evenly gap-5 h-full ">
                                <div className="flex flex-col items-start gap-2">
                                    <div>Suspicious </div>
                                    <div className=" flex w-full flex-wrap gap-1">
                                        {
                                            file?.suspicious_labels?.map((val, idx) => (
                                                <div
                                                    key={idx}
                                                    className=" bg-radial-[at_50%_75%] from-red-500 to-red-800 text-white font-bold px-2 py-1 w-fit rounded-full "
                                                >
                                                    {val}
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                                <div className="flex flex-col items-start gap-2">
                                    <div>Events and Actions </div>
                                    <div className=" flex w-full flex-wrap gap-1">
                                        {
                                            file?.action_labels?.map((val, idx) => (
                                                <div
                                                    key={idx}
                                                    className="bg-radial-[at_50%_75%] from-blue-500 to-blue-800 text-white font-bold px-2 py-1 w-fit rounded-full "
                                                >
                                                    {val}
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                <Card className={" flex flex-row bg-transparent border-0"}>
                    {/* FACES */}
                    {/* <Card className={" min-w-[400px] bg-white/10 text-white border "}> */}
                    <Table className={"text-white h-full py-0 min-w-[400px] bg-white/10 rounded-lg  "}>
                        {/* <TableCaption>Faces detected in the video</TableCaption> */}
                        <TableHeader className={""} >
                            <TableRow className={"text-white hover:bg-black/0 border-0"}>
                                <TableHead className={"w-[125px] text-white text-center text-lg"}>Faces</TableHead>
                                <TableHead className={" text-white text-center text-lg"}>Estimate Age</TableHead>
                                <TableHead className={" text-white text-center text-lg"}>AI Detected</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className={"border-0"}>
                            {
                                file?.faces_data?.length > 0 ? (
                                    file?.faces_data?.map((val, idx) => {
                                        return (
                                            <TableRow key={idx} className={"border-0 hover:bg-black/20"}>
                                                {/* FACES */}
                                                <TableCell className="align-middle">
                                                    <div className="flex flex-col items-center justify-center gap-2">
                                                        <div className='h-20 w-20 overflow-hidden rounded-full border border-white/20'>
                                                            <img className='w-full h-full aspect-square object-cover' src={val["face"]} alt={"Person " + (idx + 1)} />
                                                        </div>
                                                        <div className="text-sm">
                                                            Person - {idx + 1}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className={"text-center text-lg font-base align-middle"}>{val["estimate_age"]}</TableCell>
                                                <TableCell className="align-middle px-5">
                                                    <div className="flex items-center justify-center">
                                                        {val["ai_prediction"] === true ? (
                                                            <div className='w-16 h-16 flex items-center justify-center group rounded-xl bg-radial from-red-400 to-red-500 '>
                                                                <Bot animateOnHover className={"size-10 group-hover"} />
                                                            </div>
                                                        ) : (
                                                            <div className='w-16 h-16 flex items-center justify-center group rounded-xl bg-radial from-green-400 to-green-500 '>
                                                                <BotOff animateOnHover className={"size-10"} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                ) : (
                                    <TableRow className={" hover:bg-black/20"}>
                                        <TableCell colSpan={3} className="h-96 text-xl font-thin text-center">
                                            No faces detected
                                        </TableCell>
                                    </TableRow>
                                )}
                        </TableBody>
                    </Table>

                    {/* </Card> */}
                    <Card className={" shadow-none w-full border-0 text-white flex flex-col items-end h-fit min-h-[300px] bg-transparent "}>

                        <div className='text-2xl font-bold w-full'>
                            Assess Review
                        </div>
                        <div className='w-full'>
                            <ManagementBar mark_for_review={mark_for_review} go_to_file={go_to_file} total_pages={CaseFiles.length} className={"w-full"} />
                        </div>
                        <form onSubmit={submit_comment_review} className='w-full bg-white/10 p-5 rounded-xl'>
                            <div className='text-xl'>
                                Comment
                            </div>

                            <div className='py-2'>
                                <textarea value={file?.review_comment} onChange={(e) => setFile({ ...file, review_comment: e.target.value })} name="comment" rows={6} className='w-full border-[0.1px] border-white/20 rounded-lg focus:inset-0 focus:outline-0 p-3 ' />
                            </div>

                            <div className="w-full flex justify-end">
                                <motion.button
                                    whileTap={{ scale: 0.975 }}
                                    className=" text-lg cursor-pointer flex h-10 w-fit items-center rounded-lg bg-neutral-200 px-2.5 py-2 text-neutral-600 "
                                >
                                    Save
                                </motion.button>
                            </div>
                        </form>
                        {/*                         
                        <div className='flex flex-row gap-5 '>
                            <div className=' font-bold h-fit border border-red-700 bg-red-400 hover:bg-red-500 p-3 rounded-xl w-fit transition-all cursor-pointer '>
                                Flag for investigation
                            </div>
                            <div className=' font-bold h-fit border border-green-800 bg-green-500 hover:bg-green-600 p-3 rounded-xl w-fit transition-all cursor-pointer '>
                                All good
                            </div>
                        </div> */}
                    </Card>

                </Card>
            </div >
        </div>

    )
}

export default page;