import React from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Link } from "react-router-dom";

export default function AddFAQ() {
    const toolbarLeftTemplate = () => {
        return <h5>Add FAQ</h5>;
    };
    const toolbarRightTemplate = (
        <Link to="/faq/view">
            <Button>View FAQ</Button>
        </Link>
    );
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card p-fluid">
                    <Toolbar left={toolbarLeftTemplate} right={toolbarRightTemplate}></Toolbar>

                    <div className="field">
                        <label htmlFor="question">question</label>
                        <InputText id="question" type="text" />
                    </div>
                    <div className="field">
                        <label htmlFor="answer">answer</label>
                        <InputText id="answer" type="text" />
                    </div>
                    <div className="field">
                        <Button label="Submit"></Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
