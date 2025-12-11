'use client';

import * as React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Ban,
  X,
  Command,
  IdCard,
} from 'lucide-react';
import { Pin } from '@/components/animate-ui/icons/pin';
import { BellRing } from '@/components/animate-ui/icons/bell-ring';
import { BadgeCheck } from '@/components/animate-ui/icons/badge-check';
import { XIcon } from "@/components/animate-ui/icons/x"
import { SlidingNumber } from '@/components/animate-ui/primitives/texts/sliding-number';
import { motion } from 'motion/react';

const BUTTON_MOTION_CONFIG = {
  initial: 'rest',
  whileHover: 'hover',
  whileTap: 'tap',

  variants: {
    rest: { maxWidth: '40px' },
    hover: {
      maxWidth: '140px',
      transition: { type: 'spring', stiffness: 200, damping: 35, delay: 0.15 },
    },
    tap: { scale: 0.95 },
  },

  transition: { type: 'spring', stiffness: 250, damping: 25 }
};

const LABEL_VARIANTS = {
  rest: { opacity: 0, x: 4 },
  hover: { opacity: 1, x: 0, visibility: 'visible' },
  tap: { opacity: 1, x: 0, visibility: 'visible' },
};

const LABEL_TRANSITION = {
  type: 'spring',
  stiffness: 200,
  damping: 25,
};

function ManagementBar({ file, mark_for_review, go_to_file, total_pages, block_content, pass_content }) {

  const TOTAL_PAGES = total_pages;
  const [currentPage, setCurrentPage] = React.useState(1);

  const handlePrevPage = React.useCallback(() => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
    go_to_file("prev");
  }, [currentPage]);

  const handleNextPage = React.useCallback(() => {
    if (currentPage < TOTAL_PAGES) setCurrentPage(currentPage + 1);
    go_to_file("next");
  }, [currentPage]);

  return (
    <div className="@container/wrapper w-full flex justify-end  ">
      <div
        className="flex w-full flex-row items-center gap-y-2 rounded-xl backdrop-blur-2xl p-0">

        <div
          className="mx-auto flex flex-row flex-wrap gap-2 shrink-0 items-center justify-between w-full"
        >

          <motion.div
            // layout
            // layoutRoot
            className=" flex flex-wrap justify-between items-end gap-3 sm:flex-nowrap w-full"
          >
            <div className='flex flex-col w-fit gap-2'>
              {/* PAGINATION */}
              <div className="flex h-10">
                <button
                  disabled={currentPage === 1}
                  className="p-1 text-black hover:text-black/70 cursor-pointer transition-colors disabled:text-black/20 disabled:hover:text-black/10"
                  onClick={handlePrevPage}>
                  <ChevronLeft size={20} />
                </button>
                <div className=" flex items-center space-x-1 text-sm tabular-nums">
                  <SlidingNumber className="text-black pl-2 " padStart number={currentPage} />
                  <span className="text-black/40 min-w-8">/ {TOTAL_PAGES}</span>
                </div>
                <button
                  disabled={currentPage === TOTAL_PAGES}
                  className="p-1 text-black hover:text-black/70 cursor-pointer transition-colors disabled:text-black/20 disabled:hover:text-black/10"
                  onClick={handleNextPage}>
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Mark for review */}
              <motion.button
                whileTap={{ scale: 0.975 }}
                onClick={mark_for_review}
                // {...BUTTON_MOTION_CONFIG}
                className=" cursor-pointer flex h-10 w-48 items-center space-x-2 whitespace-nowrap rounded-lg bg-neutral-200 dark:bg-neutral-600/80 px-2.5 text-black"
                aria-label="mark_review">
                <Pin size={20} animateOnHover className="shrink-0" />
                <div
                  variants={LABEL_VARIANTS}
                  transition={LABEL_TRANSITION}
                  className=" text-sm w-full">
                  Mark for later
                </div>
              </motion.button>

              {/* PASS */}
              <motion.button
                onClick={() => { pass_content() }}
                whileTap={{ scale: 0.975 }}
                // {...BUTTON_MOTION_CONFIG}
                className=" min-w-28 cursor-pointer flex h-10 items-center space-x-2 overflow-hidden whitespace-nowrap rounded-lg bg-emerald-500 text-white px-2.5 py-2"
                aria-label="Hire">
                <BadgeCheck animateOnHover size={24} strokeWidth={2.5} className="shrink-0" />
                <motion.span
                  variants={LABEL_VARIANTS}
                  transition={LABEL_TRANSITION}
                  className="font-bold text-sm">
                  Review Pass
                </motion.span>
              </motion.button>
            </div>

            {/* ALERT THINGS */}
            <div className='flex flex-col w-fit gap-2'>
              <motion.button
                whileTap={{ scale: 0.975 }}
                // {...BUTTON_MOTION_CONFIG}
                className=" min-w-28 cursor-pointer flex h-10 items-center justify-center space-x-2 overflow-hidden whitespace-nowrap rounded-lg bg-neutral-200 text-black px-2.5 py-2"
                aria-label="Reject">
                {/* <BellRing animateOnHover size={20} strokeWidth={2.5} className="shrink-0" /> */}
                <motion.span
                  variants={LABEL_VARIANTS}
                  transition={LABEL_TRANSITION}
                  className=" text-sm">
                  Escalate
                </motion.span>
              </motion.button>


              <motion.button
                onClick={() => { block_content() }}
                whileTap={{ scale: 0.975 }}
                // {...BUTTON_MOTION_CONFIG}
                className=" min-w-28 cursor-pointer flex h-10 items-center space-x-2 overflow-hidden whitespace-nowrap rounded-lg bg-red-500 text-white px-2.5 py-2"
                aria-label="Reject">
                <XIcon animateOnHover size={20} strokeWidth={2.5} className="shrink-0" />
                <motion.span
                  variants={LABEL_VARIANTS}
                  transition={LABEL_TRANSITION}
                  className=" font-bold text-sm">
                  Block Content
                </motion.span>
              </motion.button>

              {/* <motion.button
                whileTap={{ scale: 0.975 }}
                // {...BUTTON_MOTION_CONFIG}
                className=" min-w-28 cursor-pointer flex h-10 items-center space-x-2 overflow-hidden whitespace-nowrap rounded-lg bg-red-500 text-white px-2.5 py-2"
                aria-label="Reject">
                <BellRing animateOnHover size={20} strokeWidth={2.5} className="shrink-0" />
                <motion.span
                  variants={LABEL_VARIANTS}
                  transition={LABEL_TRANSITION}
                  className=" font-bold text-sm">
                  Alert
                </motion.span>
              </motion.button> */}

              <motion.button
                onClick={() => { block_content() }}
                whileTap={{ scale: 0.975 }}
                // {...BUTTON_MOTION_CONFIG}
                className=" min-w-28 cursor-pointer flex h-10 items-center space-x-2 overflow-hidden whitespace-nowrap rounded-lg bg-red-500 text-white px-2.5 py-2"
                aria-label="Reject">
                <BellRing animateOnHover size={20} strokeWidth={2.5} className="shrink-0" />
                <motion.span
                  variants={LABEL_VARIANTS}
                  transition={LABEL_TRANSITION}
                  className=" font-bold text-sm">
                  Block & Alert NCMEC
                </motion.span>
              </motion.button>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}

export { ManagementBar };
