import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { TreeTable } from 'primereact/treetable';
import { confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { Column } from 'primereact/column';
import { ErrorMessage, Formik, Field } from 'formik';
import * as yup from 'yup';
import { ToastContainer } from "react-toastify";
import { FiUpload } from 'react-icons/fi';
import toast from "../components/Toast/Toast";
// import { NodeService } from '../service/NodeService';
// import service from '../helper/api/api';

// Interface/Helper Imports
import service from '../helper/api/api';

const Categories = () => {
    const [treeTableNodes, setTreeTableNodes] = useState([]);
    const [selectedTreeTableNodeKeys, setSelectedTreeTableNodeKeys] = useState([]);
    const [editCategoriesModal, setEditCategoriesModal] = useState(false);
    const [updateCategoryFormSpinner, setUpdateCategoryFormSpinner] = useState(false)
    const [updateId, setUpdateId] = useState('')
    const [addId, setAddId] = useState('')

    const getCategories = async () => {
        const { data } = await service({
            url: `https://prime-shopper-api.herokuapp.com/api/v1/admin/categories`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        setTreeTableNodes(data.data)
    }

    useEffect(() => {
        async function fetchAllCategoriesData() {
            await getCategories();
        }
        fetchAllCategoriesData();

    }, []);

    const updateCategoriesSchema = yup.object().shape({
        name: yup.string().required('Please enter Select data'),
        banner_image: yup.mixed().required("Please upload image").test('fileType', 'Unsupported File Format', function (value) {
            const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];
            if (value) {
                return SUPPORTED_FORMATS.includes(value.type)
            } else {
                return false
            }
        }).test('fileSize', "File Size is too large", value => {
            const sizeInBytes = 500000;
            if (value) {
                return value.size <= sizeInBytes;
            } else {
                return false
            }

        })
    });

    function getPath(model, id) {
        var path,
            item = { id: model.id };

        if (!model || typeof model !== 'object') return;

        if (model.id === id) return [item];

        (model.children || []).some(child => path = getPath(child, id));
        return path && [item, ...path];

    }

    const deleteCategory = async (node, column) => {
        try {
            console.log(node.id);

            let parentId;
            let deleteId = node.id;
            treeTableNodes.map(el => {
                let parentArray = getPath(el, node.id)
                if (parentArray && parentArray.length) {
                    return parentId = parentArray[0].id;
                }
                return false
            })

            const { data } = await service({
                url: `https://prime-shopper-api.herokuapp.com/api/v1/admin/category/delete`,
                method: 'POST',
                data: JSON.stringify({ parentId, deleteId }),
                headers: { 'Content-Type': 'application/json' }
            });

            setTreeTableNodes(data.data);

        } catch (err) {

        }
    }

    const deleteCategoryConfirm = (node, column) => {
        confirmDialog({
            message: 'Do you want to delete this category?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: () => deleteCategory(node, column),
        });
    };

    // const categoriesEditHandler = (node, column) => {
    //     console.log(node, column);
    //     setEditCategoriesModal(true)
    // }

    const categoriesAddHandler = (node, column) => {
        console.log(node.id);
        setUpdateId('')
        setAddId(node.id)
        setEditCategoriesModal(true)
    }

    const actionTemplate = (node, column) => {
        return <div className='actionButtons'>
            <Button type="button" icon="pi pi-trash" className="p-button-danger" style={{ marginRight: '.5em' }} onClick={() => { deleteCategoryConfirm(node, column) }}></Button>
            {/* <Button type="button" icon="pi pi-pencil" className="p-button-warning" onClick={() => categoriesEditHandler(node, column)}></Button> */}
            <Button type="button" icon="pi pi-plus" className="p-button-success" onClick={() => categoriesAddHandler(node, column)}></Button>
        </div>;
    }

    const bannerTemplate = (node, column) => {
        return <img src={`https://prime-shopper-api.herokuapp.com/temp/${node.data.banner}`} width="80" alt="" />
    }

    const addUpdateCategoryHandler = async (getData) => {
        try {

            let authToken = await window.localStorage.getItem('authToken');

            if (!authToken) {
                window.localStorage.removeItem("authToken")
                window.localStorage.removeItem("ValidUser")
                window.localStorage.removeItem('loginUserdata');
            }

            let parentId;
            if (addId) {
                treeTableNodes.map(el => {
                    let parentArray = getPath(el, addId)
                    if (parentArray && parentArray.length) {
                        return parentId = parentArray[0].id;
                    }
                    return false
                })
            }

            let addCategoryForm = new FormData();
            addCategoryForm.append('name', getData.name);
            addCategoryForm.append('banner', getData.banner_image);
            if (addId) {
                addCategoryForm.append('id', addId);
                addCategoryForm.append('parentId', parentId);
            }

            setUpdateCategoryFormSpinner(true);

            const { data } = await service({
                url: `https://prime-shopper-api.herokuapp.com/api/v1/admin/category/add`,
                method: 'POST',
                data: addCategoryForm,
                headers: { 'Content-Type': 'multipart/form-data', 'Authorization': JSON.parse(authToken) }
            });
            setTreeTableNodes(data.data);
            setUpdateCategoryFormSpinner(false);
            setEditCategoriesModal(false)
        } catch (err) {
            setUpdateCategoryFormSpinner(false);
            return await toast({ type: "error", message: err });
        }
    }

    const fileName = (value) => {
        if (value) {
            return "File Name:- " + value.name
        }
    }

    const fileUploadHandler = (e, setFieldValue) => {
        setFieldValue("banner_image", e.currentTarget.files[0]);
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
                        <h5>Categories List</h5>
                        <button className={'customBlueBgbtn'} onClick={() => {setUpdateId(''); setAddId(''); setEditCategoriesModal(true)}}>Add Category</button>
                    </div>
                    <TreeTable value={treeTableNodes} selectionMode="checkbox" selectionKeys={selectedTreeTableNodeKeys} onSelectionChange={(e) => setSelectedTreeTableNodeKeys(e.value)}>
                        <Column field="name" header="Name" expander />
                        <Column field="banner" body={bannerTemplate} />
                        <Column body={actionTemplate} style={{ textAlign: 'center', width: '10rem' }} />
                    </TreeTable>
                </div>
            </div>

            <Dialog header={!updateId ? "Add Category" : "Update Category"} visible={editCategoriesModal} style={{ width: '500px' }} modal onHide={() => { setEditCategoriesModal(false); setUpdateId(''); setAddId('') }}>
                <Formik
                    enableReinitialize
                    initialValues={{
                        name: '',
                        banner_image: '',
                    }}
                    validationSchema={updateCategoriesSchema}
                    onSubmit={(
                        values,
                        { setSubmitting }
                    ) => {
                        addUpdateCategoryHandler(values);
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
                                            <label>Categories name</label>
                                            <Field type="text" name="name" />
                                            <ErrorMessage name="name">
                                                {(msg) => <p className={'error'}>{msg}</p>}
                                            </ErrorMessage>
                                        </div>
                                    </div>
                                    <div className={"inputBox p-mb-3 CSVUpload"}>
                                        <label
                                            htmlFor="compareCSVFileUpload"
                                            className="button">
                                            Upload Image
                                            <FiUpload className='p-ml-auto' />
                                        </label>
                                        <p className={'fileName'}>{fileName(props.values.banner_image)}</p>
                                        <input id="compareCSVFileUpload" name="image" type="file" onChange={(e) => fileUploadHandler(e, props.setFieldValue)} className={'CSVFileUpload'} />
                                        {console.log(props)}
                                        <ErrorMessage name="banner_image">
                                            {(msg) => <p className={'error'}>{msg}</p>}
                                        </ErrorMessage>
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

export default React.memo(Categories, comparisonFn);