"use Client";

import { useEffect, useState } from 'react';
import { CirclePlus } from "@/components/animate-ui/icons/circle-plus"
import { Pin } from '@/components/animate-ui/icons/pin';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { motion } from 'motion/react';

const Sidebar = ({ CaseFiles, setCaseFiles, setFile }) => {

    const [open_add, setOpenAdd] = useState(false);

    const Url_Submit = async (e) => {
        e.preventDefault();
        const response = await fetch("/api/get-image-url", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                image_url: e.target.url.value,
            }),
        });
        const data = await response.json();
        console.log(data);

        setCaseFiles((prev) => [...prev, data.url]);
        setOpenAdd(false);
        e.target.url.value = "";
    }

    return (
        <div className=' pt-20 px-5 w-[30vw] bg-linear-90 from-blue-900 to-black '>

            <div className='sticky left-0 top-5  text-white flex flex-col items-center justify-between h-[90vh] gap-5 '>
                <div className='w-full flex flex-col items-center gap-5'>
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

                    <div className='w-full flex flex-col gap-5 items-center justify-center'>
                        {
                            CaseFiles.length > 0 ? (
                                CaseFiles.map((filedata, index) => (
                                    <div key={index}
                                        className='bg-white/20 hover:bg-white/25 backdrop-blur-md p-3 rounded-lg w-full min-h-24 cursor-pointer transition-colors '
                                        onClick={() => setFile(filedata)}
                                    >
                                        <div className='w-full flex items-center justify-between'>
                                            <div className='flex flex-col gap-5'>
                                                <div className='text-sm '>
                                                    {filedata?.image_url?.split("/")[4]}
                                                </div>
                                                <div className='flex flex-wrap justify-between gap-1'>
                                                    {filedata?.marked &&
                                                        <span className='text-sm px-3 py-0.5 rounded-3xl '>
                                                            <Pin fill="white" size={20} />
                                                        </span>
                                                    }


                                                    <span className='text-sm bg-amber-600 px-3 py-0.5 rounded-3xl '>
                                                        {filedata?.ai_result?.result.toUpperCase()}
                                                    </span>
                                                    <span className='text-sm  px-3 py-0.5 rounded-3xl '>
                                                        {filedata?.agent_result === "bad" ? "Bad" : "Good"}
                                                    </span>
                                                    <span className='text-sm  px-3 py-0.5 rounded-3xl '>
                                                        {filedata?.media_type === "image" ? "Image" : "Video"}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className='text-4xl font-thin'>
                                                {index + 1}
                                            </span>
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
                    </div>
                </div>

                <div className='w-full flex flex-col gap-3 justify-end  bg-white/10 hover:bg-white/20 p-3 rounded-xl mb-3 '>
                    <div onClick={() => setOpenAdd(!open_add)} className=' w-full flex gap-2 items-center justify-between cursor-pointer rounded-xl transition-colors'>
                        <span>
                            Add a Case
                        </span>
                        <CirclePlus animateOnHover size={20} />
                    </div>
                    {
                        open_add && (
                            <form onSubmit={Url_Submit} className='flex flex-col gap-2'>
                                <input type="url" id='url' required placeholder="Case URL" className="w-full p-2 rounded-lg border border-neutral-400 focus:outline-none " />
                                <motion.button
                                    whileTap={{ scale: 0.975 }}
                                    className="w-fit p-2 rounded-lg bg-neutral-200 text-black"
                                    type='submit'
                                >
                                    Submit
                                </motion.button>
                            </form>
                        )
                    }
                </div>
            </div>
        </div >
    );
};

export default Sidebar;