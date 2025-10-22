

import React, { ReactNode, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

const Icon = ({ children, className }: { children: string; className?: string }) => (
    <div className={cn("font-mono text-xl font-bold", className)}>{children}</div>
);


const TransitionList = ({ itemList }: { itemList: { id: string, child: ReactNode }[] }) => {


    return (
        <div className="h-36 w-full min-w-96 overflow-hidden rounded-lg bg-secondary">
            <AnimatePresence>
                {itemList.map((item) => (
                    <motion.div
                        key={item.id}
                        animate={{ height: "3rem", scale: 1 }}
                        exit={{ height: 0, scale: 0, margin: 0 }}
                        transition={{ duration: 0.5 }}
                        className="m-2 flex h-12 items-center rounded-lg border border-gray-400 bg-primary/5 text-secondary-foreground"
                    >
                        {item.child}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default TransitionList;

