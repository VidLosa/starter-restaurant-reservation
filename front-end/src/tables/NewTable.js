import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import axios from "axios"
require("dotenv").config();
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function NewTable(){
    const history = useHistory()
    const initialFormData = {
        table_name: "",
        capacity: ""
    }
    const [formData, setFormData] = useState(initialFormData)
    const [error, setError] = useState(null)

    function handleCancel(){
        history.goBack()
    }

    function handleChange(event){
        let newFormData = {...formData}
        newFormData[event.target.name] = event.target.value
        setFormData(newFormData)
    }

    async function handleSubmit(event){
        event.preventDefault()
        const abortController = new AbortController()
        const formDataCorrectTypes = {
            ...formData,
            capacity: Number(formData.capacity)
        }
        
        try {
            await axios.post(`${BASE_URL}/tables`, {data: formDataCorrectTypes}, abortController.signal)
            history.push("/dashboard")
            
        } catch (error) {
            if(error.name !== "AbortError"){
                setError(error)
            }
        }
        return () => abortController.abort();
    }

    return (
        <div>
            <h1>Create a Table</h1>
            <ErrorAlert error={error}/>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="table_name">Table Name:</label>
                            <input 
                            className="form-control"
                            name="table_name" 
                            id="table_name" 
                            type="text" 
                            required pattern=".{2,}" 
                            title="Must be at least 2 characters long." 
                            value={formData.table_name} 
                            onChange={handleChange}
                            />
                            <label htmlFor="capacity">Capacity:</label>
                            <input 
                            className="form-control"
                            name="capacity" 
                            id="capacity" 
                            type="text" 
                            required pattern="[0-9]+" 
                            title="Must be a number of 1 or more." 
                            value={formData.capacity} 
                            onChange={handleChange}
                            />
                        </div>
                        <button className="ml-2 btn btn-primary" type="submit">Submit</button>
                        <button className="ml-2 btn btn-danger" onClick={handleCancel}>Cancel</button>
                        
                    </form>
        </div>
    )
}

export default NewTable