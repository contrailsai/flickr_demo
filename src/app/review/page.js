"use client"

import { useEffect, useState } from 'react';
import { Progress } from '@/components/animate-ui/components/radix/progress';
import { Card } from "@/components/ui/card"
import { Bot } from "@/components/animate-ui/icons/bot"
import { BotOff } from "@/components/animate-ui/icons/bot-off"
import { ManagementBar } from '@/components/animate-ui/components/community/management-bar';
import { motion } from 'motion/react';

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

    const accuracy = 92.3;

    const file = {
        "media_type": "video",
        "file_url": "flicker_test_5.mp4"
    }

    const face_data = [
        {
            "name": "Person-1",
            "image": "/faces/face_1.png",
            "estimate_age": "32",
            "ai_prediction": false
        },
        {
            "name": "Person-2",
            "image": "/faces/face_2.png",
            "estimate_age": "60",
            "ai_prediction": false
        },
        {
            "name": "Person-3",
            "image": "/faces/face_3.png",
            "estimate_age": "4",
            "ai_prediction": true
        }
    ]

    const labels = {
        "suspicious": ["NSFW", "CSAM", "Weapons", "Political"],
        "events_n_actions": ["Speaking", "Watching"]
    }

    return (
        <div className='flex divide-x divide-white bg-black '>
            <div className=' absolute top-0 left-0 m-0 bg-white/30 backdrop-blur-xl w-screen h-14 z-20 px-5 py-2 flex items-center border-b '>

                <div className='text-white font-bold text-xl'>
                    Cases Review
                </div>
            </div>

            {/* sidebar */}
            <div className=' pt-20 px-5 w-[30vw] bg-linear-90 from-blue-900 to-black '>

                <div className='sticky left-0 top-5  text-white flex flex-col items-center gap-5 '>
                    <div className='bg-white/20 pb-4 px-3 rounded-lg w-full'>
                        <Table className={""}>
                            <TableBody className={""}>
                                <TableRow className={"hover:bg-transparent border-0 "}>
                                    <TableHead className={"text-white text-center"}>AI generated</TableHead>
                                    <TableHead className={"text-white text-center mx-2"}>Suspicious</TableHead>
                                    <TableHead className={"text-white text-center mx-2"}></TableHead>
                                    <TableHead className={"text-white text-center mx-2"}>Harmful</TableHead>
                                </TableRow>
                                <TableRow className={"hover:bg-transparent"}>
                                    <TableHead className={"text-white text-center font-bold "}>5</TableHead>
                                    <TableHead className={"text-white bg-radial from-orange-800 to-orange-500 rounded-full text-center font-bold mx-2"}>4</TableHead>
                                    <TableHead className={""}></TableHead>
                                    <TableHead className={"text-white bg-radial from-red-800 to-red-500 rounded-full text-center font-bold mx-2"}>4</TableHead>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <div className='bg-white/20 hover:bg-white/25 backdrop-blur-md p-3 rounded-lg w-full min-h-24 cursor-pointer transition-colors '>
                        <div className='w-full flex items-center justify-between'>
                            <div className='flex flex-col gap-5'>
                                <div className='text-xl'>
                                    Case-URL/Filename-Here
                                </div>
                                <div className='flex flex-wrap gap-1'>
                                    <span className='text-sm bg-amber-600 px-3 py-0.5 rounded-3xl '>
                                        AI
                                    </span>
                                    <span className='text-sm  px-3 py-0.5 rounded-3xl '>
                                        Violent
                                    </span>
                                    <span className='text-sm  px-3 py-0.5 rounded-3xl '>
                                        removal required
                                    </span>
                                </div>
                            </div>
                            <span className='text-4xl font-thin'>
                                1
                            </span>
                        </div>
                        <div>

                        </div>
                    </div>

                    <div className='bg-white/20 hover:bg-white/25 backdrop-blur-md p-3 rounded-lg w-full min-h-24 cursor-pointer transition-colors '>
                        <div className='w-full flex items-center justify-between'>
                            <div className='flex flex-col gap-5'>
                                <div className='text-xl'>
                                    Case-URL/Filename-Here
                                </div>
                                <div className='flex flex-wrap gap-1'>
                                    <span className='text-sm bg-amber-600 px-3 py-0.5 rounded-3xl '>
                                        AI
                                    </span>
                                    <span className='text-sm  px-3 py-0.5 rounded-3xl '>
                                        Violent
                                    </span>
                                    <span className='text-sm  px-3 py-0.5 rounded-3xl '>
                                        removal required
                                    </span>
                                </div>
                            </div>
                            <span className='text-4xl font-thin'>
                                2
                            </span>
                        </div>
                        <div>

                        </div>
                    </div>

                    <div className='bg-white/20 hover:bg-white/25 backdrop-blur-md p-3 rounded-lg w-full min-h-24 cursor-pointer transition-colors '>
                        <div className='w-full flex items-center justify-between'>
                            <div className='flex flex-col gap-5'>
                                <div className='text-xl'>
                                    Case-URL/Filename-Here
                                </div>
                                <div className='flex flex-wrap gap-1'>
                                    <span className='text-sm bg-amber-600 px-3 py-0.5 rounded-3xl '>
                                        AI
                                    </span>
                                    <span className='text-sm  px-3 py-0.5 rounded-3xl '>
                                        Violent
                                    </span>
                                    <span className='text-sm  px-3 py-0.5 rounded-3xl '>
                                        removal required
                                    </span>
                                </div>
                            </div>
                            <span className='text-4xl font-thin'>
                                3
                            </span>
                        </div>
                        <div>

                        </div>
                    </div>



                </div>
            </div>

            {/* case review */}
            <div className=" pt-20 w-full p-5 bg-linear-90 to-blue-900 from-black text-white ">

                <div className="flex gap-5 ">
                    <Card className={" max-w-1/2 max-h-[70vh] overflow-hidden aspect-auto p-0 bg-white/10 backdrop-blur-xl bg-radial-[at_50%_75%] from-black/50 to-transparent border-0 "} >

                        {
                            file["media_type"] === "image" &&
                            (
                                <img src={file["file_url"]} className="w-full h-full" />
                            )
                        }
                        {
                            file["media_type"] === "video" &&
                            (
                                <video controls src={file["file_url"]} className="w-full h-full" />
                            )
                        }
                    </Card>

                    <div className={"  max-w-1/2 w-full text-white bg-transparent shadow-none py-0 flex flex-col gap-5"}>
                        {/* OVERALL RESULT */}
                        <Card className={"p-5 text-white bg-white/10 backdrop-blur-lg border-0 "}>
                            <div className="font-bold text-2xl ">
                                Agent Review
                            </div>
                            <div className="">
                                No harmful activity or event detected
                            </div>
                        </Card>

                        {/* AI DETECTION */}
                        <Card className={"p-5 text-white bg-white/10 backdrop-blur-lg border-0 "}>
                            <div className="font-bold text-2xl ">
                                AI Detection Result
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text">
                                    Fully AI generated
                                </div>
                                <div className=' max-w-[220px]'>
                                    <div className="font-bold" >
                                        Accuracy - {accuracy}%
                                    </div>
                                    <div>
                                        <Progress
                                            value={accuracy}
                                            className={"w-full border border-white/30 "}
                                            indicator_className={(accuracy > 60 ? " bg-linear-90 from-green-600 to-green-400" : accuracy > 40 ? "bg-linear-90 from-orange-600 to-orange-400" : "bg-linear-90 from-red-600 to-red-400")}
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
                                            labels["suspicious"].map((val, idx) => (
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
                                            labels["events_n_actions"].map((val, idx) => (
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
                                <TableHead className={" text-white text-center text-lg"}>AI detetcted</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className={"border-0"}>
                            {
                                face_data.map((val, idx) => {
                                    return (
                                        <TableRow key={idx} className={"border-0 hover:bg-black/20"}>
                                            {/* FACES */}
                                            <TableCell className=" flex flex-col items-center gap-2 py-5 ">
                                                <div className='h-20 w-20 overflow-hidden rounded-full'>
                                                    <img className='w-full h-full aspect-square object-cover' src={val["image"]} alt={val["name"]} />
                                                </div>
                                                <div>
                                                    {val["name"]}
                                                </div>
                                            </TableCell>
                                            <TableCell className={"text-center text-lg font-base"}>{val["estimate_age"]}</TableCell>
                                            <TableCell className=" flex justify-center px-5">
                                                {val["ai_prediction"] === true ? (
                                                    <div className='w-16 h-16 flex items-center justify-center group rounded-xl bg-radial from-red-400 to-red-500 '>
                                                        <Bot animateOnHover className={"size-10 group-hover"} />
                                                    </div>
                                                ) : (
                                                    <div className='w-16 h-16 flex items-center justify-center group rounded-xl bg-radial from-green-400 to-green-500 '>
                                                        <BotOff animateOnHover className={"size-10"} />
                                                    </div>
                                                )}</TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>

                    {/* </Card> */}

                    <Card className={" shadow-none w-full border-0 text-white flex flex-col items-end h-fit min-h-[300px] bg-transparent "}>

                        <div className='text-2xl font-bold w-full'>
                            Assess Review
                        </div>
                        <div className='w-full'>
                            <ManagementBar className={"w-full"} />
                        </div>
                        <div className='w-full bg-white/10 p-5 rounded-xl'>
                            <div className='text-xl'>
                                Comment
                            </div>

                            <div className='py-2'>
                                <textarea rows={6} className='w-full border-[0.1px] border-white/20 rounded-lg focus:inset-0 focus:outline-0 p-3 ' />
                            </div>

                            <div className="w-full flex justify-end">
                                <motion.button
                                    whileTap={{ scale: 0.975 }}
                                    className=" text-lg cursor-pointer flex h-10 w-fit items-center rounded-lg bg-neutral-200 px-2.5 py-2 text-neutral-600 "
                                >
                                    Submit
                                </motion.button>
                            </div>
                        </div>
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