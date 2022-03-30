import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export default function Viewstudent() {
    const data = [
        {
            Image: "https://thumbs.dreamstime.com/z/handsome-man-suit-portrait-elegant-sitting-armchair-grunge-background-studio-shot-116485646.jpg",
            name: "vishal",
            email: "sojitravishal571@gmail.com",
            password: "Vishal@123",
            Mnum: "9099990571",
            createdAt: "2022-02-21T12:04:04.434Z",
            updatedAt: "2022-02-21T12:04:04.435Z",
            done: "10",
            cart: "3",
        },
        {
            Image: "https://thumbs.dreamstime.com/z/handsome-man-suit-portrait-elegant-sitting-armchair-grunge-background-studio-shot-116485646.jpg",
            name: "niraj",
            email: "sojitraniraj@gmail.com",
            password: "Niraj@123",
            Mnum: "9904446242",
            createdAt: "2022-02-21T12:04:04.434Z",
            updatedAt: "2022-02-21T12:04:04.435Z",
            done: "9",
            cart: "5",
        },
    ];
    const imageBodyTemplate = (rowData) => {
        return <img src={rowData.Image} alt={rowData.Image} className="product-image" width="100px" hight="100px" />;
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <DataTable value={data} responsiveLayout="scroll">
                        <Column header="Image" body={imageBodyTemplate}></Column>
                        <Column field="name" header="Name"></Column>
                        <Column field="email" header="Email"></Column>
                        <Column field="password" header="Password"></Column>
                        <Column field="Mnum" header="Mobile No."></Column>
                        <Column field="createdAt" header="createdAt"></Column>
                        <Column field="updatedAt" header="updatedAt"></Column>
                        <Column field="done" header="Done_Ordar"></Column>
                        <Column field="cart" header="In_cart"></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
}
