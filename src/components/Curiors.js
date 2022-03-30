import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { Column } from 'primereact/column';
import { ErrorMessage, Formik, Field } from 'formik';
import * as yup from 'yup';
import { ToastContainer } from "react-toastify";
import toast from "./Toast/Toast";
// import { NodeService } from '../service/NodeService';
// import service from '../helper/api/api';

// Interface/Helper Imports
import service from '../helper/api/api';

const Curiors = () => {
    const [couriorsData, setCouriorsData] = useState([]);
    const [editCategoriesModal, setEditCategoriesModal] = useState(false);
    const [updateCategoryFormSpinner, setUpdateCategoryFormSpinner] = useState(false)
    const [updateId, setUpdateId] = useState('')

    const getCategories = async () => {
        const { data } = await service({
            url: `https://prime-shopper-api.herokuapp.com/api/v1/admin/couriers`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        console.log(data.data);
        setCouriorsData(data.data)
    }

    useEffect(() => {
        async function fetchAllCategoriesData() {
            await getCategories();
        }
        fetchAllCategoriesData();

    }, []);

    const updateCategoriesSchema = yup.object().shape({
        name: yup.string().required('Please enter name')
    });

    const deleteCourier = async (node, column) => {
        try {
            console.log(node._id);
            let deleteId = node._id;

            const { data } = await service({
                url: `https://prime-shopper-api.herokuapp.com/api/v1/admin/courier/delete`,
                method: 'POST',
                data: JSON.stringify({id: deleteId}),
                headers: { 'Content-Type': 'application/json' }
            });

            setCouriorsData(data.data);

        } catch (err) {

        }
    }

    const deleteCourierConfirm = (node, column) => {
        confirmDialog({
            message: 'Do you want to delete this courier?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: () => deleteCourier(node, column),
        });
    };

    // const categoriesEditHandler = (node, column) => {
    //     console.log(node, column);
    //     setEditCategoriesModal(true)
    // }
    
    const actionTemplate = (node, column) => {
        return <div className='actionButtons'>
            <Button type="button" icon="pi pi-trash" className="p-button-danger" style={{ marginRight: '.5em' }} onClick={() => { deleteCourierConfirm(node, column) }}></Button>
        </div>;
    }
    
    const addUpdateCourierHandler = async (getData) => {
        try {

            let authToken = await window.localStorage.getItem('authToken');

            if (!authToken) {
                window.localStorage.removeItem("authToken")
                window.localStorage.removeItem("ValidUser")
                window.localStorage.removeItem('loginUserdata');
            }
            console.log({name: getData.name});
            let addCourierForm = new FormData();
            addCourierForm.append('name', getData.name);

            setUpdateCategoryFormSpinner(true);

            const { data } = await service({
                url: `https://prime-shopper-api.herokuapp.com/api/v1/admin/courier/add`,
                method: 'POST',
                data: JSON.stringify({name: getData.name}),
                // headers: { 'Content-Type': 'multipart/form-data', 'Authorization': JSON.parse(authToken) }
                headers: { 'Content-Type': 'application/json' }
            });
            setCouriorsData(data.data);
            setUpdateCategoryFormSpinner(false);
            setEditCategoriesModal(false)
        } catch (err) {
            setUpdateCategoryFormSpinner(false);
            return await toast({ type: "error", message: err });
        }
    }

    return (
        <div className="grid">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <div className="col-12">
                <div className="card categoryBox">
                    <div className='p-d-flex p-jc-between p-ai-center p-mb-2'>
                        <h5>Curiors</h5>
                        <button className={'customBlueBgbtn'} onClick={() => { setUpdateId(''); setEditCategoriesModal(true) }}>Add Curior</button>
                    </div>
                    <DataTable value={couriorsData} responsiveLayout="scroll">
                        <Column field="name" header="Name"></Column>
                        <Column body={actionTemplate} style={{ textAlign: 'center', width: '10rem' }} />
                    </DataTable>
                </div>
            </div>

            <Dialog header={!updateId ? "Add Curior" : "Update Curior"} visible={editCategoriesModal} style={{ width: '500px' }} modal onHide={() => { setEditCategoriesModal(false); setUpdateId(''); }}>
                <Formik
                    enableReinitialize
                    initialValues={{
                        name: ''
                    }}
                    validationSchema={updateCategoriesSchema}
                    onSubmit={(
                        values,
                        { setSubmitting }
                    ) => {
                        addUpdateCourierHandler(values);
                        setSubmitting(false);
                    }}
                >
                    {props => (
                        <form onSubmit={props.handleSubmit}>
                            {
                                updateCategoryFormSpinner ? <div className={'formSpinner'}>
                                    <div className={'loading'}></div>
                                </div> : null
                            }
                            <div className={'replaceDataModal'}>
                                <div className={'inputFields'}>
                                    <div className={'replaceFields'}>
                                        <div className={'inputBox'}>
                                            <label>Curiors name</label>
                                            <Field type="text" name="name" />
                                            <ErrorMessage name="name">
                                                {(msg) => <p className={'error'}>{msg}</p>}
                                            </ErrorMessage>
                                        </div>
                                    </div>

                                    <div className="p-d-flex p-ai-center p-mt-4">
                                        <div className="p-m-auto">
                                            <button type='submit' className={'customBlueBgbtn'}>Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                </Formik>
            </Dialog>

        </div>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Curiors, comparisonFn);