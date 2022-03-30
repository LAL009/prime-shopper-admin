import React from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Link } from "react-router-dom";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";

export default function ViewFAQ() {
    const data = [
        {
            question: "what is your name",
            answer: "ayush",
        },
        {
            question: "what is your name",
            answer: "ayush",
        },
        {
            question: "what is your name",
            answer: "ayush",
        },
    ];
    const toolbarLeftTemplate = () => {
        return <h5>FAQ</h5>;
    };
    const toolbarRightTemplate = (
        <Link to="/faq/add">
            <Button>Add FAQ</Button>
        </Link>
    );
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Toolbar left={toolbarLeftTemplate} right={toolbarRightTemplate}></Toolbar>
                    <Accordion activeIndex={0}>
                        {data.map((e, i) => {
                            return (
                                <AccordionTab key={"faq" + i} header={e.question}>
                                    <p>{e.answer}</p>
                                </AccordionTab>
                            );
                        })}
                    </Accordion>
                </div>
            </div>
        </div>
    );
}
