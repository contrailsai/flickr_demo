"use client";
import LineChart from "./LineChart";
import { useRef, useState } from "react";
import { UserCircle, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function Result_UI({ results }) {

    // console.log("results", results);

    const frame_graph_Ref = useRef();
    const frame_person_refs = [useRef(), useRef(), useRef()];

    let result_values = null;

    // const [frame_charts, setframecharts] = useState(null);
    const [toggle_open, set_toggle_open] = useState(null);

    let frame_charts = null;
    const fps = results["fps"];
    const duration = results["duration"];

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

    //-------------------------------------------------
    const get_chart_data = (duration, person_obj_list, threshold = 0.7) => {
        let person_prediction_data = []
        // default value 0.7 (if no data at that timestamp (frames in 1 sec))
        for (let i = 0; i <= duration; i++)
            person_prediction_data[i] = normalize_value(threshold, threshold);

        let used_values = [];

        let count = 0;
        let prediction_sum = 0;
        let curr_processing_time = 0;
        // iterating through all data points of this person each point contains (start_index, end_index, prediction)
        for (let person_data of person_obj_list) {
            const time = Math.floor(person_data.start_index / fps);
            if (curr_processing_time !== time) {
                // set the value to the average of all values in that second
                let prediciton_value = prediction_sum / count;

                prediciton_value = normalize_value(prediciton_value, threshold);
                person_prediction_data[curr_processing_time] = prediciton_value;
                // reset values with the new time value
                count = 1;
                prediction_sum = 0;
                curr_processing_time = time;
            }
            else {
                prediction_sum += person_data.prediction;
                count += 1;
            }
            used_values.push(person_data.prediction)
        }

        const mean_result = used_values.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / used_values.length;
        let mean_prediction_value = normalize_value(mean_result, threshold);

        return { person_prediction_data, mean_prediction_value };
    }

    // 3 cases
    // using only returned values good looking curves, inconsistent with time frames 
    // USING BOTJH 

    const update_frame_chart = () => {
        let temp_chart_data = {};
        let temp_frame_values = {};

        // const duration = results["duration"];
        const threshold_for_graph = 0.5; // since we normalize it
        const threshold = 0.7;

        for (let person_idx in results["faces_data"]) {
            if (results["faces_data"][person_idx]["indices"].length <= 0) {
                continue;
            }
            // console.log("frame chart pass: ", label);
            // const person = results["faces_data"][person];
            const { person_prediction_data, mean_prediction_value } = get_chart_data(duration, results["faces_data"][person_idx]["indices"], threshold);

            // console.log("label : ", label);
            // console.log("prediction table : ", person_prediction_data);
            // console.log("person : ", person_idx);

            temp_frame_values[person_idx] = {
                "prediction": mean_prediction_value > 0.5, // threshold after normalization is 0.5
                "percentage": (mean_prediction_value * 100).toFixed(2),
                "data_points": results["faces_data"][person_idx]["indices"].length
            };

            // console.log("person prediction data : ", person_prediction_data);
            temp_chart_data[person_idx] = {

                labels: Object.keys(person_prediction_data).map(
                    (idx) => { return idx }
                ),
                datasets: [
                    {
                        label: "Probablility of real",
                        data: Object.values(person_prediction_data),
                        backgroundColor: Object.values(person_prediction_data).map((pred) => {
                            return pred >= threshold_for_graph ? "rgba(0,255,0,0.2)" : "rgba(255,0,0,0.2)"
                        }),
                        // borderColor: person.map((val, idx) => { return val.prediciton >= 0 ? "rgba(0,255,0,0.3)" : "rgba(255,0,0,0.3)" }),
                        // borderWidth: 0.75,
                        barPercentage: 1,
                        borderRadius: 100,
                        inflateAmount: 1,
                        base: threshold_for_graph
                    },
                    {
                        type: 'line',
                        borderColor: "rgba(0,0,100, 0.3)",
                        pointRadius: 0,
                        fill: {
                            target: { value: threshold_for_graph },
                            above: "rgba(0,255,0,0.3)",   // Area above the origin
                            below: "rgba(255,0,0,0.3)"    // below the origin
                        },
                        lineTension: 0.4,
                        spanGaps: true,
                        data: Object.values(person_prediction_data),
                        borderWidth: 1,
                    },
                ]
            };
        }
        // console.log("final frame values data = ", temp_frame_values)
        frame_charts = temp_chart_data;
        // setframecharts(temp_chart_data);
        return temp_frame_values;
    }

    // LOAD CHART AND RESULTS
    // console.log("creating graphs, results");
    // console.log("frameCheck", results["frameCheck"]);

    let temp_result_values = {
        "frameCheck": undefined,
    };
    // format frame data for Chart, result UI 
    temp_result_values["frameCheck"] = update_frame_chart();

    // console.log(temp_result_values);
    result_values = temp_result_values;
    console.log("result_values", result_values)
    console.log("frame_charts", frame_charts)

    return (
        <div className="min-h-screen bg-white text-black">
            {/* VIDEO RESULTS + CHARTS */}
            <div className=" flex flex-col relative">

                {/* FRAME CHECK */}
                <div className={` opacity-100 z-20 max-w-[42.5vw] overflow-hidden duration-300 transition-all`}>
                    <div ref={frame_graph_Ref} className={` h-full flex flex-col gap-2 py-5 rounded-3xl overflow-hidden`}>
                        {
                            Object.keys(results["faces_data"])
                                .filter((v) => { return results["faces_data"][v]["indices"].length > 0 })
                                .sort((a, b) => result_values["frameCheck"][b]["data_points"] - result_values["frameCheck"][a]["data_points"])
                                .slice(0, 10)
                                .map((label, idx) => {

                                    const perc = result_values && result_values["frameCheck"][label] ? result_values["frameCheck"][label]["percentage"] : 0;
                                    const pred = result_values && result_values["frameCheck"][label] ? result_values["frameCheck"][label]["prediction"] : false;
                                    const threshold = 0.7; // Default threshold since it's not in the data
                                    if (isNaN(perc)) {
                                        return null;
                                    }
                                    return (
                                        <div key={idx} className=" flex flex-col w-[42.5vw]">
                                            <div
                                                className={` group rounded-3xl bg-blue-700 border-8 border-blue-700 flex ${toggle_open === idx ? "h-72" : " "} transition-all overflow-hidden `}
                                                key={idx}
                                            >
                                                {/* PERSON DETAILS */}
                                                <div
                                                    onClick={() => { toggle_open === idx ? set_toggle_open(null) : set_toggle_open(idx) }}
                                                    className=" cursor-pointer text-white flex flex-row items-center px-2 group relative"
                                                >
                                                    {/* ARROW */}
                                                    <div className={` absolute top-5 left-0  h-5 w-5 ${toggle_open === idx ? " rotate-90 group-hover:rotate-[70deg]" : " group-hover:rotate-[20deg]"}  transition-all`}>
                                                        <ChevronRight strokeWidth={1} className=" size-6" />
                                                    </div>

                                                    <div className={` flex flex-col justify-between items-center min-w-[169px]  h-full ${toggle_open === idx ? "py-5" : ""} transition-all`}>

                                                        {/* PERSON IMAGE + LABEL */}
                                                        <div className={` flex ${toggle_open === idx ? "flex-col" : "flex-row"} justify-evenly items-center w-full gap-2 `}>

                                                            <div className="rounded-full overflow-hidden flex">
                                                                {
                                                                    results?.faces_data[label]?.face ?
                                                                        <img src={results.faces_data[label].face} width={56} height={56} alt={`Person - ${Number(idx) + 1} `} />
                                                                        :
                                                                        <UserCircle className="size-14" strokeWidth={1} />
                                                                }
                                                            </div>
                                                            <div className=" ">
                                                                Person {Number(idx) + 1}
                                                            </div>
                                                        </div>
                                                        {
                                                            toggle_open === idx &&
                                                            <div className="flex flex-col gap-3 h-full items-center justify-center">
                                                                <div className=' flex flex-row items-center justify-between min-w-36 w-full'>
                                                                    <span className=" text-xs">
                                                                        Result
                                                                    </span>
                                                                    <span className={` text-sm px-3 py-0.5 rounded-3xl  font-semibold ${pred ? " bg-green-200  text-green-700" : " bg-red-200  text-red-700"}`}>
                                                                        {pred ? "Real" : "Fake"}
                                                                    </span>
                                                                </div>
                                                                <div className=' flex flex-row items-center justify-between min-w-36 w-full'>
                                                                    <span className="text-xs">
                                                                        Estimate Age
                                                                    </span>
                                                                    <span className={` text-sm px-3 py-0.5 rounded-3xl  font-semibold ${pred ? " bg-green-200  text-green-700" : " bg-red-200  text-red-700"}`}>
                                                                        {isNaN(perc) ? "-" : results?.faces_data[label]?.estimate_age}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>

                                                </div>

                                                <div className={`w-full flex flex-col bg-white rounded-2xl overflow-hidden ${toggle_open === idx ? 'ml-0' : 'ml-8'} transition-all `}>

                                                    {/* PERSON's VIDEO SECTIONS */}
                                                    < div className={` ${toggle_open === idx ? 'max-h-0' : 'max-h-72'} w-full min-w-[27vw] h-full pr-2 bg-white flex items-center relative rounded-xl overflow-hidden transition-all `}>
                                                        {/* REFERENCE LINE */}
                                                        <div className="bg-gray-300 w-full h-px" />
                                                        {
                                                            frame_charts[label]["datasets"][0]["data"].map((v, i) => {
                                                                const total_elements = frame_charts[label]["datasets"][0]["data"].length;
                                                                let width = 100 / total_elements;
                                                                let start = 100 * i / total_elements;
                                                                if (isNaN(v)) {
                                                                    return (
                                                                        <div
                                                                            key={i}
                                                                            style={{ width: `${width}%`, left: `${start}%` }}
                                                                            className={` h-full absolute `}
                                                                        />
                                                                    );
                                                                };
                                                                return (
                                                                    <div
                                                                        key={i}
                                                                        style={{ width: `${width}%`, left: `${start}%` }}
                                                                        className={` h-full absolute ${v > 0.5 ? 'bg-green-400' : v < 0.5 ? 'bg-red-400' : ''}`}
                                                                    />
                                                                );
                                                            })
                                                        }
                                                        {/* <div className="h-full w-20 bg-red-500/40 absolute"/> */}
                                                    </div>

                                                    {/* PERSON's GRAPH */}
                                                    <div className={` ${toggle_open === idx ? 'max-h-72' : 'max-h-0'} h-full w-full rounded-2xl px-2 overflow-hidden transition-all `}>
                                                        {frame_charts &&
                                                            idx < 3 ?
                                                            (
                                                                <div className="chart-container" ref={frame_person_refs[idx]} >
                                                                    <LineChart chartData={frame_charts[label]} />
                                                                </div>
                                                            )
                                                            :
                                                            (
                                                                <div className="chart-container">
                                                                    <LineChart chartData={frame_charts[label]} />
                                                                </div>
                                                            )
                                                        }
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                        }
                    </div>
                </div>
            </div>

        </div >
    );
}
