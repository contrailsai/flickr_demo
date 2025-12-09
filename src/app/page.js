"use client"

import { useEffect, useState } from 'react';
import { Progress } from '@/components/animate-ui/components/radix/progress';
import { Card } from "@/components/ui/card"
import { Bot } from "@/components/animate-ui/icons/bot"
import { BotOff } from "@/components/animate-ui/icons/bot-off"
import { ManagementBar } from '@/components/animate-ui/components/community/management-bar';
import { motion } from 'motion/react';
import SidebarLeft from '@/app/review/Sidebar';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Result_UI from '@/app/review/Video_UI'

const page = () => {
    const [file, setFile] = useState(null);
    const [CaseFiles, setCaseFiles] = useState([]);

    useEffect(() => {
        const fetch_active_files = async () => {
            let tries = 0;
            while (tries < 5) {
                try {
                    const response = await fetch("/api/get-active-files", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    const data = await response.json();
                    console.log(data, data.error);
                    if (data.error !== undefined) {
                        console.log(data.error);
                        throw new Error(data.error);
                    }
                    setCaseFiles(data);
                    console.log(data);
                    break;
                }
                catch (error) {
                    tries++;
                    console.log(tries, error);
                }
            }
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
                    comment: [...file?.review_comment, e.target.comment.value],
                }),
            })
            const data = await response.json();
            console.log(data);
            setFile({ ...file, review_comment: [...file?.review_comment, e.target.comment.value] });
            e.target.comment.value = "";
        }
        catch (error) {
            console.log(error);
        }
    }

    const normalize_value = (prediction_value, threshold) => {
        // NORMALIZE IT TO BE CORRECT   (0 - th) => (0, 0.5) and (th - 1) => (0.5 - 1) use y=mx+c to make the eqs
        if (prediction_value > threshold) {
            prediction_value = (0.5 * (prediction_value + 1) - threshold) / (1 - threshold);
        }
        else {
            prediction_value = (0.5 * prediction_value) / (threshold);
        }
        return prediction_value;
    }

    return (
        <div className='flex divide-x-[0.5px] divide-blue-600/50 '>
            <div className=' absolute z-30 top-0 left-0 m-0 bg-blue-600/10 backdrop-blur-xl w-screen h-14 px-5 py-2 flex items-center justify-between border-b-[0.5px] border-blue-600/50 '>

                {/* <div className='text-black font-bold text-xl'>
                    Cases Review
                </div> */}
                <div className='h-8'>
                    <img className='w-full h-full object-cover ' src="flickr_logo.png" alt="flickr" />
                </div>
                <div className='flex items-center gap-2'>
                    <div className=' h-11'>
                        <img className='w-full h-full object-cover ' src="logo_long.png" alt="logo" />
                    </div>
                    {/* <div className='text-blue-700 font-bold text-3xl'>
                        Contrails AI
                    </div> */}
                </div>
            </div>

            {/* sidebar */}
            <SidebarLeft CaseFiles={CaseFiles} setCaseFiles={setCaseFiles} setFile={setFile} />

            {/* case review */}
            <div className=" mt-14 max-h-[90vh] overflow-auto w-full p-5 bg-linear-90 to-white from-white text-white ">

                <div className="flex gap-5 ">
                    <Card className={" w-full flex items-center justify-center shadow-none min-h-[30vh] overflow-hidden aspect-auto p-0 bg-muted text-black backdrop-blur-xl border "} >

                        {file === null && (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="text-black/50 font-light text-2xl">
                                    No File Selected
                                </div>
                            </div>
                        )}
                        {
                            file && file["media_type"] === "image" &&
                            (
                                <img src={file["image_url"]} className="w-full h-full max-w-[300px] object-contain" />
                            )
                        }
                        {
                            file && file["media_type"] === "video" &&
                            (
                                <video controls src={file["image_url"]} className="w-full h-full max-w-[300px]" />
                            )
                        }
                    </Card>
                </div>

                <Card className={" flex flex-row bg-transparent border-0 shadow-none rounded-lg"}>

                    {
                        file?.media_type === "image" && (
                            <>
                                {/* FACES */}
                                < Card className={" h-fit w-full p-0 border text-white shadow-none "}>
                                    <Table className={"text-white h-full py-0 min-w-[400px] rounded-xl overflow-hidden  "}>
                                        {/* <TableCaption>Faces detected in the video</TableCaption> */}
                                        <TableHeader className={"  "} >
                                            <TableRow className={"text-black hover:bg-black/0 border-0"}>
                                                <TableHead className={"w-[125px] text-black text-center font-light text-lg"}>Faces</TableHead>
                                                <TableHead className={" text-black text-center font-light text-lg"}>Estimate Age</TableHead>
                                                <TableHead className={" text-black text-center font-light text-lg"}>AI Detected</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className={" text-black p-0 "}>
                                            {
                                                file?.faces_data?.length > 0 ? (
                                                    file?.faces_data?.map((val, idx) => {
                                                        return (
                                                            <TableRow key={idx} className={"border-0 bg-white hover:bg-muted transition-all"}>
                                                                {/* FACES */}
                                                                <TableCell className="align-middle">
                                                                    <div className="flex flex-col items-center justify-center gap-2">
                                                                        <div className='h-16 w-16 overflow-hidden rounded-full border'>
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
                                                                            <div className='w-16 h-16 flex items-center justify-center group rounded-xl bg-radial from-emerald-400 to-emerald-500 '>
                                                                                <BotOff animateOnHover className={"size-10"} />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })
                                                ) : (
                                                    <TableRow className={" bg-white hover:bg-muted transition-color"}>
                                                        <TableCell colSpan={3} className="h-96 text-xl font-thin text-center">
                                                            No faces detected
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                        </TableBody>
                                    </Table>
                                </Card>
                            </>
                        )
                    }
                    {
                        file?.media_type === "video" && (
                            <>
                                <Result_UI results={file} />
                            </>
                        )
                    }
                </Card>
            </div >

            {/* SIDEBAR RIGHT */}
            <div className=' pt-16 w-full min-w-[25vw] max-w-[30vw] overflow-hidden'>

                <div className='sticky left-0 top-5  text-white flex flex-col items-center justify-between h-[90vh] border-0 px-5 gap-5 '>
                    <div className={" text-white bg-transparent shadow-none py-0 flex flex-col gap-5 w-full"}>
                        {/* AI DETECTION */}
                        <Card className={"p-5 w-full text-black border shadow-sm backdrop-blur-lg "}>
                            <div className=" text-xl ">
                                AI Detection Result
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-sm border px-2 py-0.5 rounded-full bg-muted">
                                    {file?.ai_result?.result == null ? "Pending" : file?.ai_result?.result === "ai" ? "Fully AI generated" : "Not AI generated"}
                                </div>
                                <div className=' max-w-[220px]'>
                                    <div className="font-semibold text-xs" >
                                        AI SCORE - {file?.ai_result?.accuracy == null ? "X" : (normalize_value(file?.ai_result?.accuracy, 0.7) * 100).toFixed(2)}%
                                    </div>
                                    <div>
                                        <Progress
                                            value={file?.ai_result?.accuracy == null ? 0 : normalize_value(file?.ai_result?.accuracy, 0.7) * 100}
                                            className={"w-full border border-white/30 "}
                                            indicator_className={((file?.ai_result?.accuracy == null ? "bg-red-400" : (normalize_value(file?.ai_result?.accuracy, 0.7) * 100)) > 60 ? " bg-red-400" : (normalize_value(file?.ai_result?.accuracy, 0.7) * 100) > 40 ? "bg-orange-400" : "bg-emerald-400")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* LABELS */}
                        <Card className={"p-5 text-black border shadow-sm backdrop-blur-lg"}>
                            <div className=" text-xl ">
                                Policy Violations
                            </div>
                            <div className=" flex flex-col justify-evenly gap-5 h-full ">
                                {/* <div className="flex flex-col items-start gap-2"> */}
                                {/* <div>Suspicious </div> */}
                                <div className=" flex w-full flex-wrap gap-1">
                                    {
                                        file?.suspicious_labels?.map((val, idx) => (
                                            <div
                                                key={idx}
                                                className=" bg-red-500 text-white font-semibold px-2 py-1 w-fit rounded-full "
                                            >
                                                {val}
                                            </div>
                                        ))
                                    }
                                </div>
                                {/* </div> */}
                                {/* <div className="flex flex-col items-start gap-2">
                                    <div>Events and Actions </div>
                                    <div className=" flex w-full flex-wrap gap-1">
                                        {
                                            file?.action_labels?.map((val, idx) => (
                                                <div
                                                    key={idx}
                                                    className="bg-blue-500 text-white font-bold px-2 py-1 w-fit rounded-full "
                                                >
                                                    {val}
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div> */}
                            </div>
                        </Card>
                    </div>

                    <Card className={" flex flex-col justify-between p-0 shadow-none w-full border-0 text-white h-full min-h-[300px] bg-transparent "}>


                        {/* <div className='text-2xl font-bold w-full text-black'>
                            Assess Review
                        </div> */}
                        <form onSubmit={submit_comment_review} className='w-full bg-white  rounded-xl'>
                            <div className='text-xl font-light  text-black'>
                                Comments
                            </div>
                            {
                                file?.review_comment && (
                                    <div className=' p-5 gap-2 border rounded-r-2xl rounded-b-2xl text-black flex flex-col justify-top items-end bg-muted/50 overflow-auto max-h-[220px] min-h-[150px]'>
                                        {
                                            file.review_comment.length > 0 ?
                                                file.review_comment.map((v, i) => (
                                                    <div className=' text-lg font-light border text-right w-fit px-5 py-0.5 rounded-l-2xl rounded-t-2xl bg-white ' key={i}>
                                                        {v}
                                                    </div>
                                                ))
                                                :
                                                <div className=' text-xl w-full h-full flex items-center justify-center font-light text-right px-5 py-0.5 '>
                                                    No Comments Available
                                                </div>
                                        }
                                    </div>
                                )
                            }

                            <div className='py-2 flex gap-2  '>
                                <textarea
                                    // value={file?.review_comment ? file?.review_comment : ""}
                                    // onChange={(e) => setFile({ ...file, review_comment: e.target.value })}
                                    name="comment"
                                    rows={1}
                                    placeholder='Enter your comment'
                                    className=' min-h-12 w-full text-black border outline-0 focus:outline-2 focus:outline-blue-700/20 focus:bg-white/5 rounded-lg focus:inset-0 p-3 transition-all '
                                />
                                <motion.button
                                    whileTap={{ scale: 0.975 }}
                                    className=" text-lg cursor-pointer flex w-fit items-center rounded-lg bg-blue-700 px-2.5 py-2 text-white "
                                >
                                    Save
                                </motion.button>
                            </div>
                        </form>

                        <div className='w-full '>
                            <ManagementBar mark_for_review={mark_for_review} go_to_file={go_to_file} total_pages={CaseFiles.length} className={"w-full"} />
                        </div>
                        {/*                         
                        <div className='flex flex-row gap-5 '>
                            <div className=' font-bold h-fit border border-red-700 bg-red-400 hover:bg-red-500 p-3 rounded-xl w-fit transition-all cursor-pointer '>
                                Flag for investigation
                            </div>
                            <div className=' font-bold h-fit border border-emerald-800 bg-emerald-500 hover:bg-emerald-600 p-3 rounded-xl w-fit transition-all cursor-pointer '>
                                All good
                            </div>
                        </div> */}

                    </Card>
                </div>
            </div>
        </div >

    )
}

export default page;